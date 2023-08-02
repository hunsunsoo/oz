package com.fire4bird.oz.game.calculation.manager;

import com.fire4bird.oz.game.calculation.dto.request.*;
import com.fire4bird.oz.game.calculation.dto.response.GuessAnswerRes;
import com.fire4bird.oz.game.calculation.dto.response.HelperRes;
import com.fire4bird.oz.game.calculation.dto.response.HelperSubmitRes;
import com.fire4bird.oz.game.calculation.dto.response.SetBoardRes;
import com.fire4bird.oz.game.calculation.service.CalculationService;
import com.fire4bird.oz.team.service.TeamService;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;

import java.util.*;

@Getter
@Setter
@Slf4j
// 게임에 필요한 전체적인 로직 관리
public class GameManager {
    private TeamService teamService;
    private CalculationService calculationService;
    private Set<Integer> userIdSet;
    private int answer;
    private int[][] numberBoard;
    private Integer roomId;
    private String roleString;
    private boolean isGameStarted;
    private int helperCount;
    private int answerCount;

    public GameManager() {}

    public GameManager(Integer roomId, TeamService teamService, CalculationService calculationService){
        this.roomId = roomId;
        this.teamService = teamService;
        this.calculationService = calculationService;
        this.userIdSet = new HashSet<>();
        this.helperCount = 0;
        this.answerCount = 0;
    }

    /**
     * 게임에 참여한 사용자의 수를 카운트하는 메서드
     * @return 게임을 시작할지 여부
     */
    public boolean addPlayer(Integer userId){
        userIdSet.add(userId);
        boolean allConnected = userIdSet.size() == 4;
        if(allConnected){
            if(isGameStarted){
                return false;
            }
            // 게임이 시작되지 않았다면 게임 시작 표시
            isGameStarted = true;
            return true;
        }
        return false;
    }

    public SetBoardRes setGame(InitReq req){
        SetBoardRes setBoardRes = new SetBoardRes();
        setBoardRes.setNumberBoard(this.setNumberBoard());
        setBoardRes.setAnswer(this.setAnswerNumber());
        return calculationService.initSave(req, setBoardRes);
    }

    public int setAnswerNumber(){
        Random random = new Random();
        this.answer = random.nextInt(119) + 1;
        return answer;
    }

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
