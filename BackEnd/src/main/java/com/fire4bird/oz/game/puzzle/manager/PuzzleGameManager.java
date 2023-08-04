//package com.fire4bird.oz.game.puzzle.manager;
//
//import com.fire4bird.oz.game.calculation.dto.request.*;
//import com.fire4bird.oz.game.calculation.dto.response.*;
//import com.fire4bird.oz.game.calculation.entity.Player;
//import com.fire4bird.oz.game.puzzle.service.PuzzleService;
//import com.fire4bird.oz.round.entity.UserRound;
//import com.fire4bird.oz.round.service.RoundService;
//import lombok.AllArgsConstructor;
//import lombok.Getter;
//import lombok.NoArgsConstructor;
//import lombok.Setter;
//import lombok.extern.slf4j.Slf4j;
//
//import java.util.Arrays;
//import java.util.LinkedList;
//import java.util.List;
//import java.util.Random;
//
//@Getter
//@Setter
//@Slf4j
//@NoArgsConstructor
//@AllArgsConstructor
//// 게임의 시작부터 끝까지의 로직이 담긴 각각의 게임을 관리할 객체
//public class PuzzleGameManager {
//    // 해당 게임의 시작부터 끝까지 필요한 정보들 관리
//    // 필요한 변수들 알아서 설정
//    // 라운드 정보를 알기 위한 roundService
//    private RoundService roundService;
//    // 게임에 대한 모든 데이터를 저장할 puzzleService
//    private PuzzleService puzzleService;
//    private String session;
//    // 게임을 진행 중인 유저와 역할을 저장할 list
//    private List<Player> players;
//    // 랜덤으로 설정된 정답과 숫자판 -> 게임 시작 때마다 init
//    private int answer;
//    private int[][] numberBoard;
//    // 각각의 게임을 구분지어 줄 roundId
//    // 한 roundId(팀, 회차가 pk)마다 진행할 수 있는 게임은 한 게임이라 키값으로 관리
//    private Integer roundId;
//    // 회차의 몇 번째 도전인지
//    private Integer turn;
//    // 게임이 시작되었는지 확인하는 변수
//    private boolean isGameStarted;
//    // 조력자가 선택한 블럭의 숫자 관리, 객체가 만들어질 때 0으로 초기화
//    private int helperCount;
//
////    public PuzzleGameManager(Integer roundId, String session, RoundService roundService, PuzzleService puzzleService){
////        this.roundId = roundId;
////        this.roundService = roundService;
////        this.session = session;
////        System.out.println(session);
////        List<UserRound> userRounds = roundService.findAllRoundByRoundId(roundId);
////        players = new LinkedList<>();
////        this.puzzleService = puzzleService;
////        this.helperCount = 0;
////        this.isGameStarted = true;
////        this.setRole(userRounds);
////    }
//
//    // 본인에게 맞는 역할을 넣어 주는 메서드
//    public void setRole(List<UserRound> userRounds){
//        for(UserRound userRound : userRounds){
//            if(userRound.getRole() == 3)  // 역할이 허수아비(actor)면 1 조력자면 0
//                players.add(new Player(userRound.getUser(), 1));
//            else players.add(new Player(userRound.getUser(), 0));
//        }
//    }
//
//    public int checkAnswer(String answer){
//
//        return -1;
//    }
//
//}
