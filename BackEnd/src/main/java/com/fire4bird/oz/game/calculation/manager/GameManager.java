package com.fire4bird.oz.game.calculation.manager;

import com.fire4bird.oz.game.calculation.dto.request.*;
import com.fire4bird.oz.game.calculation.dto.response.*;
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
import java.util.concurrent.ConcurrentHashMap;

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
    private String session;
    // 게임을 진행 중인 유저와 역할을 저장할 list
    private List<Player> players;
    // 몇 명 준비됐는지 확인
    private int readyCount;
    // 랜덤으로 설정된 정답과 숫자판 -> 게임 시작 때마다 init
    private int answer;
    private int[][] numberBoard;
    private Map<Character, Point> boardMap;
    // 각각의 게임을 구분지어 줄 roundId
    // 한 roundId(팀, 회차가 pk)마다 진행할 수 있는 게임은 한 게임이라 키값으로 관리
    private Integer roundId;
    // 회차의 몇 번째 도전인지
    private Integer turn;
    // 게임이 시작되었는지 확인하는 변수
    private boolean isGameStarted;
    private boolean isBoardMaked;
    // 조력자가 선택한 블럭의 숫자 관리, 객체가 만들어질 때 0으로 초기화
    private int helperCount;

    public GameManager(Integer roundId, String session, RoundService roundService, CalculationService calculationService){
        this.roundId = roundId;
        this.roundService = roundService;
        this.session = session;
        System.out.println(session);
        List<UserRound> userRounds = roundService.findAllRoundByRoundId(roundId);
        players = new LinkedList<>();
        this.calculationService = calculationService;
        this.helperCount = 0;
        this.isGameStarted = false;
        this.isBoardMaked = false;
        this.boardMap = new ConcurrentHashMap<>();

        this.setPlayerState(userRounds);
    }

    // 본인에게 맞는 역할을 넣어 주는 메서드
    public void setPlayerState(List<UserRound> userRounds){
        for(UserRound userRound : userRounds){
//            players.add(new Player(userRound.getUser(), userRound.getRole()));
            if(userRound.getRole() == 3)  // 역할이 허수아비(actor)면 1 조력자면 0
                players.add(new Player(userRound.getUser(), 1));
            else players.add(new Player(userRound.getUser(), 0));
        }
    }

    public GetReadyRes startAvailable(int role){
        if(!players.get(role-1).isReady()){
            players.get(role-1).setReady(true);
            readyCount++;
        }else{
            players.get(role-1).setReady(false);
            readyCount--;
        }
        if(readyCount == 4) this.isGameStarted = true;

        GetReadyRes res = new GetReadyRes();
        res.setRole(role);
        res.setReadyCount(this.readyCount);
        return res;
    }

    // 게임 setting(만들어진 설정들을 db에 저장)
    public SetBoardRes setGame(Integer roundId){
        SetBoardRes res = new SetBoardRes();
        if(!this.isBoardMaked){
            this.isBoardMaked = true;
            InitReq req = new InitReq();
            req.setRoundId(roundId);
            req.setAnswer(this.setAnswerNumber());
            req.setNumberBoard(this.setNumberBoard());

            res = calculationService.initSave(req);
            res.setNumberBoard(this.numberBoard);
            res.setSession(this.session);
            this.turn = res.getTurn();
        }else{
            res.setTurn(this.turn);
            res.setNumberBoard(this.numberBoard);
            res.setSession(this.session);
        }

        return res;
    }

    // 랜덤 정답을 생성
    public int setAnswerNumber(){
        Random random = new Random();
        this.answer = random.nextInt(119) + 1;
        return answer;
    }

    static class Point{
        int r, c, value;

        public Point(int r, int c, int value){
            this.r = r;
            this.c = c;
            this.value = value;
        }
    }
    // 랜덤 숫자판 생성
    public String setNumberBoard(){
        numberBoard = new int[6][6];
        List<Integer> number = new LinkedList<>();
        char[][] middleBoard = {{'A', 'B', 'C', 'D', 'E', 'F'},
                {'G', 'H', 'I', 'J', 'K', 'L'},
                {'M', 'N', 'O', 'P', 'Q', 'R'},
                {'S', 'T', 'U', 'V', 'W', 'X'},
                {'Y', 'Z', 'a', 'b', 'c', 'd'},
                {'e', 'f', 'g', 'h', 'i', 'j'}};

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
                boardMap.put(middleBoard[i][j], new Point(i, j, numberBoard[i][j]));
                number.remove(x);
            }
            boards[i] = Arrays.toString(numberBoard[i]);
        }

        return Arrays.toString(boards);
    }

    public SetAnswerRes getAnswer(){
        SetAnswerRes res = new SetAnswerRes();
        res.setAnswer(this.answer);
        res.setSession(this.session);
        return res;
    }

    public HelperRes helperLog(HelperLogReq req){
        HelperRes helperRes = new HelperRes();
        if(req.getIsSelected() == 1) this.helperCount++;
        else this.helperCount--;
        helperRes.setValue(req.getValue());
        helperRes.setSession(this.session);

        int[] temp= new int[2];
        temp[0] = boardMap.get(req.getValue()).r;
        temp[1] = boardMap.get(req.getValue()).c;
        calculationService.helperLog(req, this.turn, Arrays.toString(temp));
        return helperRes;
    }

    public HelperSubmitRes helperSubmit(HelperSubmitReq req) {
        // ['a', 'B', 'C', 'D', 'E', 'i']
        char[] selected = req.getSelectedNums();
        String[][] middleBoard = {{"A", "B", "C", "D", "E", "F"},
                {"G", "H", "I", "J", "K", "L"},
                {"M", "N", "O", "P", "Q", "R"},
                {"S", "T", "U", "V", "W", "X"},
                {"Y", "Z", "a", "b", "c", "d"},
                {"e", "f", "g", "h", "i", "j"}};

        String[] log = new String[6];
        for(int i = 0; i<6; i++){
            int[] temp= new int[2];
            temp[0] = boardMap.get(selected[i]).r;
            temp[1] = boardMap.get(selected[i]).c;
            middleBoard[temp[0]][temp[1]] = Integer.toString(boardMap.get(selected[i]).value);
            log[i] = Arrays.toString(temp);
        }

        calculationService.helperUpdate(req, Arrays.toString(log));
        HelperSubmitRes helperSubmitRes = new HelperSubmitRes();
        helperSubmitRes.setSelectedNums(middleBoard);
        helperSubmitRes.setSession(this.session);
        return helperSubmitRes;
    }

    public void actorLog(ActorLogReq req) {
        int[] temp= new int[2];
        temp[0] = boardMap.get(req.getValue()).r;
        temp[1] = boardMap.get(req.getValue()).c;
        calculationService.actorLog(req, this.turn, Arrays.toString(temp));
    }

    public void actorReset(ActorResetReq req) {
        calculationService.acotrReset(req, this.turn);
    }

    // 주어진 String 값으로 계산을 해 답과 비교
    public GuessAnswerRes guessAnswer(ActorAnswerReq req){
        boolean isCorrect = false;
        // req에 들어 있을 numbers 예시
        // ['a', 'A', 'G']
        // ['+', '*']

        int[] num = new int[3];
        String[] log = new String[3];
        for(int i = 0; i<3; i++){
            num[i] = boardMap.get(req.getSelectedNums()[i]).value;
            int[] temp = new int[2];
            temp[0] = boardMap.get(req.getSelectedNums()[i]).r;
            temp[1] = boardMap.get(req.getSelectedNums()[i]).c;
            log[i] = Arrays.toString(temp);
        }

        num[0] = boardMap.get(req.getSelectedNums()[0]).value;
        num[1] = boardMap.get(req.getSelectedNums()[1]).value;
        num[2] = boardMap.get(req.getSelectedNums()[2]).value;
        int ans = 0;

        switch(req.getMarks()[0]){
            case '*':
                ans = num[0] * num[1];
                break;
            case '/':
                ans = num[0] / num[1];
                if(num[0] % num[1] != 1)
                    return new GuessAnswerRes(this.session,false, true, ans);
                break;
            case '+':
                ans = num[0] + num[1];
                break;
            case '-':
                ans = num[0] - num[1];
                break;
        }

        switch(req.getMarks()[1]){
            case '*':
                ans *= num[2];
                break;
            case '/':
                if(ans%num[2] != 0 )
                    return new GuessAnswerRes(this.session, false, true, ans);
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
        calculationService.submitAnswer(req, ans, Arrays.toString(log));
        return new GuessAnswerRes(this.session, isCorrect, true, ans);
    }


}
