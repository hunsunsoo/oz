package com.fire4bird.oz.game.calculation.manager;

import com.fire4bird.oz.game.calculation.dto.request.*;
import com.fire4bird.oz.game.calculation.dto.response.GuessAnswerRes;
import com.fire4bird.oz.game.calculation.dto.response.HelperRes;
import com.fire4bird.oz.game.calculation.dto.response.HelperSubmitRes;
import com.fire4bird.oz.game.calculation.dto.response.SetBoardRes;
import com.fire4bird.oz.game.calculation.entity.Player;
import com.fire4bird.oz.game.calculation.service.CalculationService;
import com.fire4bird.oz.round.entity.UserRound;
import com.fire4bird.oz.round.service.RoundService;
import com.fire4bird.oz.team.entity.Team;
import com.fire4bird.oz.team.service.TeamService;
import com.fire4bird.oz.user.entity.User;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.parameters.P;

import java.util.*;

@Getter
@Setter
@Slf4j
// 게임의 시작부터 끝까지의 로직이 담긴 각각의 게임을 관리할 객체
public class GameManager {
    // 해당 게임의 시작부터 끝까지 필요한 정보들 관리
    // 필요한 변수들 알아서 설정
    // 라운드 정보를 알기 위한 roundService
    private RoundService roundService;
    // 게임에 대한 모든 데이터를 저장할 calculationService
    private CalculationService calculationService;
    // 게임을 진행 중인 유저의 역할을 저장할 map(1: 허수아비, 2: 도로시, 3: 사자, 4: 양철 나무꾼)
    private List<Player> players;
    // 랜덤으로 설정된 정답과 숫자판 -> 게임 시작 때마다 init
    private int answer;
    private int[][] numberBoard;
    // 각각의 게임을 구분지어 줄 roundId
    // 한 roundId(팀, 회차가 pk)마다 진행할 수 있는 게임은 한 게임이라 키값으로 관리
    private Integer roundId;
    // 게임이 시작되었는지 확인하는 변수
    private boolean isGameStarted;
    // 조력자가 선택한 블럭의 숫자 관리, 객체가 만들어질 때 0으로 초기화
    private int helperCount;
    // 허수아비가 선택한 정답의 개수, 없어질 수 있음
    private int answerCount;

    public GameManager(Integer roundId, RoundService roundService, CalculationService calculationService){
        this.roundId = roundId;
        this.roundService = roundService;
        List<UserRound> userRounds = roundService.findAllRoundByRoundId(roundId);
        players = new LinkedList<>();
        this.calculationService = calculationService;
        this.helperCount = 0;
        this.answerCount = 0;

        this.setRole(userRounds);
    }

    // 본인에게 맞는 역할을 넣어 주는 메서드
    public void setRole(List<UserRound> userRounds){
        for(UserRound userRound : userRounds){
            if(userRound.getRole() == 3)  // 역할이 허수아비(actor)면 1 조력자면 0
                players.add(new Player(userRound.getUser(), 1));
            else players.add(new Player(userRound.getUser(), 0));
        }
    }

    // 게임 setting(만들어진 설정들을 db에 저장)
    public SetBoardRes setGame(Integer roundId){
        InitReq req = new InitReq();
        req.setRoundId(roundId);
        req.setAnswer(this.setAnswerNumber());
        req.setNumberBoard(this.setNumberBoard());

        return calculationService.initSave(req);
    }

    // 랜덤 정답을 생성
    public int setAnswerNumber(){
        Random random = new Random();
        this.answer = random.nextInt(119) + 1;
        return answer;
    }

    // 랜덤 숫자판 생성
    public String setNumberBoard(){
        numberBoard = new int[6][6];
        List<Integer> number = new LinkedList<>();
        for(int i = 0; i<36; i++){
            number.add(i%12 + 1);
        }
        int index = 36;
        Random random = new Random();
        String[] boards = new String[6];
        for(int i = 0; i<6; i++){
            for(int j = 0; j<6; j++){
                int x = random.nextInt(index--);
                numberBoard[i][j] = number.get(x);
                number.remove(x);
            }
            boards[i] = Arrays.toString(numberBoard[i]);
        }

        return Arrays.toString(boards);
    }

    // 주어진 String 값으로 계산을 해 답과 비교
    public GuessAnswerRes guessAnswer(SubmitAnswerReq req){
        calculationService.submitAnswer(req);
        boolean isCorrect = false;
        // req에 들어 있을 numbers 예시
        // [[y, x], [y, x], [y, x]]
        String heo = req.getNumbers();
        String giho = req.getMarks();

        int firstY = 2;
        int firstX = 5;
        int[] num = new int[3];
        for(int i = 0; i<3; i++){
            num[i] = numberBoard[heo.charAt(firstY)-'0'][heo.charAt(firstX)-'0'];
            System.out.println("허수 숫자 " + (i+1) + ": " + numberBoard[heo.charAt(firstY)-'0'][heo.charAt(firstX)-'0']);
            firstY += 8;
            firstX += 8;
        }
        int ans = 0;

        switch(giho.charAt(1)){
            case '*':
                ans = num[0] * num[1];
                break;
            case '/':
                ans = num[0] / num[1];
                if(num[0] % num[1] != 1)
                    return new GuessAnswerRes(req.getUserId(), false, true, ans);
                break;
            case '+':
                ans = num[0] + num[1];
                break;
            case '-':
                ans = num[0] - num[1];
                break;
        }

        switch(giho.charAt(4)){
            case '*':
                ans *= num[2];
                break;
            case '/':
                if(ans%num[2] != 0 )
                    return new GuessAnswerRes(req.getUserId(), false, true, ans);
                ans /= num[2];
                break;
            case '+':
                ans += num[2];
                break;
            case '-':
                ans -= num[2];
                break;
        }

        if(answer == ans) isCorrect =  true;
        return new GuessAnswerRes(req.getUserId(), isCorrect, true, ans);
    }

    public HelperRes getHelperNum(HelperSubmitReq req){
        HelperRes helperRes = new HelperRes();
        if(req.getSelected() == 1) this.helperCount++;
        else this.helperCount--;
        helperRes.setR(req.getR());
        helperRes.setC(req.getC());

        calculationService.getHelperNum(req);
        return helperRes;
    }


    public int isCalculationGameCompleted(){
        return 0;
    }

    public HelperSubmitRes showHelp(HelperSubmitAllReq req) {
        // [[y, x], [y, x], [y, x], [y, x], [y, x], [y, x]]
        String selected = req.getSelectedNums();
        int firstY = 2;
        int firstX = 5;
        int[] num = new int[6];
        for(int i = 0; i<6; i++){
            num[i] = numberBoard[selected.charAt(firstY)-'0'][selected.charAt(firstX)-'0'];
            firstY += 8;
            firstX += 8;
        }

        calculationService.helpUpdate(req);
        HelperSubmitRes helperSubmitRes = new HelperSubmitRes();
        helperSubmitRes.setSelectedNums(num);
        return helperSubmitRes;
    }

    public void selectAnswerOne(ActorSelectOneReq req) {
        calculationService.actorLog(req);
    }
}
