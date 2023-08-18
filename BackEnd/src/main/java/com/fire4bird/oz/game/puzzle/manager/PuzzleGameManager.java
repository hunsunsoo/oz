package com.fire4bird.oz.game.puzzle.manager;

import com.fire4bird.oz.game.puzzle.dto.SendData;
import com.fire4bird.oz.game.puzzle.dto.req.PuzzleStartReq;
import com.fire4bird.oz.game.puzzle.entity.Puzzle;
import com.fire4bird.oz.game.puzzle.mapper.PuzzleMapper;
import com.fire4bird.oz.round.entity.Round;
import com.fire4bird.oz.socket.dto.SocketMessage;
import com.fire4bird.oz.socket.repository.SocketRepository;
import com.fire4bird.oz.socket.service.RedisPublisher;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.*;


@Slf4j
@AllArgsConstructor
// 게임의 시작부터 끝까지의 로직이 담긴 각각의 게임을 관리할 객체
public class PuzzleGameManager {
    private final SocketRepository socketRepository;
    private final RedisPublisher redisPublisher;
    private final PuzzleMapper puzzleMapper;

    private Map<Integer, String> board;
    private List<String> row;
    private List<String> col;
    private String[] boardList;
    private String[] answer;//안보여지는 퍼즐
    private String[] provide;//보여지는 퍼즐

    public PuzzleGameManager(SocketRepository socketRepository, RedisPublisher redisPublisher, PuzzleMapper puzzleMapper){
        this.socketRepository = socketRepository;
        this.redisPublisher = redisPublisher;
        this.puzzleMapper = puzzleMapper;
        this.board = new HashMap<>();
        this.row = Arrays.asList("1","2","3","4","5","6");
        this.col = Arrays.asList("1","2","3","4","5","6");
        this.boardList = new String[7];
        this.answer = new String[3];//안보여지는 퍼즐
        this.provide = new String[3];//보여지는 퍼즐
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

        //양철나무꾼 보드판
        SendData sendData1 = puzzleMapper.sendData(135,String.join(",", provide));
        publisher(req.getRtcSession(),"puzzle/start/"+4,"양철나무꾼의 보이는 상형문자 전달",sendData1);

        //조력자 보드판
        for(int i=0; i<3; i++) {
            SendData sendData2 = puzzleMapper.sendData(246,String.join(",", answer));
            publisher(req.getRtcSession(),"puzzle/start/"+(i + 1),"조력자의 보이는 상형문자 전달", sendData2);
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
                    if (i < 5) answerStr.append(", ");
                }
            }
        }

//        log.info(boardStr+", //"+answerStr+", //"+String.join(",", provide)+", //"+String.join(",", answer));

        return puzzleMapper.sendPuzzle(findRound,boardStr.toString(),answerStr.toString(),turn);
    }

    public void publisher(String rtcSession, String type, String msg, Object data){
        SocketMessage message = puzzleMapper.sendSocketMessage(type, rtcSession, msg, data);

        redisPublisher.publish(socketRepository.getTopic(message.getRtcSession()), message);
    }
}
