package com.fire4bird.oz.game.calculation.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class GameResult {
    private static final String RESULT_FAIL_MESSAGE = "스테이지 도전에 실패하셨습니다.";
    private static final String RESULT_SUCCESS_MESSAGE = "스테이지를 클리어하셨습니다.";
    private static final String RESULT_ERROR_MESSAGE = "게임 실행 중 에러가 발생해 대기실로 돌아갑니다.";

    private String msg;
    private boolean isFinished;
    private boolean completeHelp;

    public GameResult() {}

    public GameResult(GameResultType type){
        this.isFinished = true;
        switch (type){
            case RESULT_FAIL:
                this.msg = RESULT_FAIL_MESSAGE;
                break;
            case RESULT_SUCCESS:
                this.msg = RESULT_SUCCESS_MESSAGE;
                break;
            case RESULT_ERROR:
                this.msg = RESULT_ERROR_MESSAGE;
        }
    }

    public GameResult(boolean completeHelp){
        this.isFinished = false;
        this.completeHelp = completeHelp;

    }

    public static GameResult returnSuccess(){
        return new GameResult(GameResultType.RESULT_SUCCESS);
    }

    public static GameResult returnFail(){
        return new GameResult(GameResultType.RESULT_FAIL);
    }

}
