package com.fire4bird.oz.game.puzzle.service;

import com.fire4bird.oz.game.puzzle.dto.AnswerDto;
import com.fire4bird.oz.game.puzzle.dto.req.PuzzleLogDto;
import com.fire4bird.oz.game.puzzle.entity.Puzzle;
import com.fire4bird.oz.game.puzzle.entity.PuzzleLog;
import com.fire4bird.oz.game.puzzle.repository.PuzzleLogRepository;
import com.fire4bird.oz.game.puzzle.repository.PuzzleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PuzzleService {
    private final PuzzleRepository puzzleRepository;
    private final PuzzleLogRepository puzzleLogRepository;
    List<String> row = Arrays.asList("1","2","3","4","5","6","7");
    List<String> col = Arrays.asList("1","2","3","4","5","6");
    String[] boadList = new String[6];
    String[] answer = new String[3];//안보여지는 퍼즐
    String[] provide = new String[3];//보여지는 퍼즐

    //게임 시작시 뿌려줄 데이터
    public void gameStart() {

        Collections.shuffle(row);
        Collections.shuffle(col);

        for(int i=0; i<col.size(); i++)
            boadList[i] = row.get(i) + col.get(i);

        for(int i=0; i<3; i++){
            answer[i] = boadList[i];
            provide[i] = boadList[i+3];
        }

        Puzzle puzzle = Puzzle.builder().board(String.join(",", boadList)).answer(String.join(",", answer)).turn(1).build();
        puzzleRepository.save(puzzle);
//        System.out.println(String.join(",", boadList)+", "+String.join(",", answer)+", "+String.join(",", provide));

//        //유저에따라
//        startGameDto.setAnswerPuzzle("");//안보여지는 퍼즐
//        startGameDto.setProvidePuzzle("");//보여지는 퍼즐
//        return startGameDto;
    }

    public void gameLog(PuzzleLogDto puzzleLogDto){
        PuzzleLog puzzleLog = PuzzleLog.builder()
                .userId(puzzleLogDto.getUserId())
                .isSystem(puzzleLogDto.getIsSystem())
                .logType(puzzleLogDto.getLogType())
                .message(puzzleLogDto.getMessage())
                .build();

        puzzleLogRepository.save(puzzleLog);
    }

    public void gameAnswer(AnswerDto answerDto){
        Puzzle puzzle = new Puzzle();
        puzzle.setUserAnswer(answerDto.getUserAnswer());
        puzzle.setIsCheck(1);//성공여부
        puzzleRepository.save(puzzle);
    }

}
