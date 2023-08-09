package com.fire4bird.oz.game.puzzle.manager;

import com.fire4bird.oz.game.puzzle.dto.SendData;
import com.fire4bird.oz.game.puzzle.dto.req.PuzzleStartReq;
import com.fire4bird.oz.game.puzzle.entity.Puzzle;
import com.fire4bird.oz.round.entity.Round;
import com.fire4bird.oz.socket.dto.SocketMessage;
import com.fire4bird.oz.socket.repository.SocketRepository;
import com.fire4bird.oz.socket.service.RedisPublisher;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.*;


@Slf4j
@AllArgsConstructor
// 게임의 시작부터 끝까지의 로직이 담긴 각각의 게임을 관리할 객체
public class PuzzleGameManager {
    private final SocketRepository socketRepository;
    private final RedisPublisher redisPublisher;

    private Map<Integer, String> board;
    private List<String> row;
    private List<String> col;
    private String[] boardList;
    private String[] answer;//안보여지는 퍼즐
    private String[] provide;//보여지는 퍼즐

    private Map<String, int[]> ready;

    public PuzzleGameManager(SocketRepository socketRepository, RedisPublisher redisPublisher){
        this.socketRepository = socketRepository;
        this.redisPublisher = redisPublisher;
        this.board = new HashMap<>();
        this.ready = new HashMap<>();
        this.row = Arrays.asList("1","2","3","4","5","6");
        this.col = Arrays.asList("1","2","3","4","5","6");
        this.boardList = new String[7];
        this.answer = new String[3];//안보여지는 퍼즐
        this.provide = new String[3];//보여지는 퍼즐
    }

    public void checkReady(int role, String rtcSession, int state){
        int check = 1;

        if (ready.containsKey(rtcSession)) {
            int[] roles = ready.get(rtcSession);
            roles[role-1] = state;
            ready.replace(rtcSession, roles);
        } else {
            int[] newRoles = new int[4];
            newRoles[role-1] = state;
            ready.put(rtcSession, newRoles);
        }

        int[] roles = ready.get(rtcSession);
        for(int people : roles){
            if (people == 0) {
                check = -1;
                break;
            }
        }

        publisher(rtcSession, "puzzle/ready","게임 준비 확인",check);
    }

    public Puzzle statGame(PuzzleStartReq req, Round findRound, int turn){

        Collections.shuffle(row);
        Collections.shuffle(col);

        for(int i=0; i<col.size(); i++) {
            boardList[i] = row.get(i) + col.get(i);
            board.put(i+1, boardList[i]);
        }

        for (int i = 0; i < 3; i++) {
            provide[i] = board.get(2 * i + 1);  // 짝수 인덱스 값을 할당
            answer[i] = board.get(2 * i + 2);   // 홀수 인덱스 값을 할당
        }

        //양나
        SendData sendData2 = SendData.builder()
                .location(135)
                .puzzle(String.join(",", provide))
                .build();
        rolePublisher(req,4,sendData2);

        //조력자
        for(int i=0; i<3; i++) {
            SendData sendData = SendData.builder()
                    .location(246)
                    .puzzle(String.join(",", answer))
                    .build();
            rolePublisher(req, i + 1, sendData);
        }

        //정답 저장. 문자열로 변환
        StringBuilder boardStr = new StringBuilder();
        StringBuilder answerStr = new StringBuilder();
        for (int i = 1; i < board.size()+1; i++) {
            boardStr.append(i).append(":").append(board.get(i));
            if (i <= board.size()) {
                boardStr.append(", ");
                if (i % 2 == 0) {
                    answerStr.append(i).append(":").append(board.get(i));
                    if (i < 6) answerStr.append(", ");
                }
            }
        }

//        log.info(boardStr+", //"+answerStr+", //"+String.join(",", provide)+", //"+String.join(",", answer));

        return Puzzle.builder()
                .board(boardStr.toString())
                .answer(answerStr.toString())
                .turn(turn)
                .round(findRound)
                .build();
    }

//    public int checkAnswer(String userAnswer, String answer){
//        int check = 1;
//        String[] answers = answer.split(", ");
//        String[] userAnswers = userAnswer.split(", ");
//
//        for (int i = 0; i < answers.length; i++) {
//            String[] ans = answers[i].split(":");
//            String[] userAns = userAnswers[i].split(":");
//            if (!Objects.equals(ans[1], userAns[1])) {
//                check = -1;
//                break;
//            }
//        }
//
//        return check;
//    }

    public void rolePublisher(PuzzleStartReq req, int userRole, SendData data){
        SocketMessage message = SocketMessage.builder()
                .rtcSession(req.getRtcSession())
                .message(userRole+"의 보이는 상형문자 전달")
                .type("puzzle/start/"+userRole)
                .data(data)
                .build();
        redisPublisher.publish(socketRepository.getTopic(message.getRtcSession()), message);
    }

    public void publisher(String rtcSession, String url, String msg, int check){
        SocketMessage message = SocketMessage.builder()
                .rtcSession(rtcSession)
                .message(msg)
                .type(url)
                .data(check)
                .build();
        redisPublisher.publish(socketRepository.getTopic(message.getRtcSession()), message);
    }
}
