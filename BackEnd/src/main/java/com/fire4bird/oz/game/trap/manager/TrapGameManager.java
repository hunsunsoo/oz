package com.fire4bird.oz.game.trap.manager;

import com.fire4bird.oz.game.trap.dto.req.LionMoveReq;
import com.fire4bird.oz.game.trap.dto.req.TrapStartReq;
import com.fire4bird.oz.game.trap.dto.res.SendAid;
import com.fire4bird.oz.game.trap.dto.res.SendLion;
import com.fire4bird.oz.game.trap.dto.res.SendResult;
import com.fire4bird.oz.game.trap.entity.Trap;
import com.fire4bird.oz.round.entity.Round;
import com.fire4bird.oz.socket.dto.SocketMessage;
import com.fire4bird.oz.socket.repository.SocketRepository;
import com.fire4bird.oz.socket.service.RedisPublisher;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.Random;

@Slf4j
@AllArgsConstructor
public class TrapGameManager {
    private final SocketRepository socketRepository;
    private final RedisPublisher redisPublisher;

    private int[][] map; // 맵을 저장할 변수


    public TrapGameManager(SocketRepository socketRepository, RedisPublisher redisPublisher) {
        this.socketRepository = socketRepository;
        this.redisPublisher = redisPublisher;
        this.map = new int[6][6];

    }

    public Trap startGame(TrapStartReq req, Round findRound, int turn){
        map = TrapMapGenerator.generateMap();

        // startX startY destX destY keyX keyY 각좌표 임시저장
        int[] point = new int[6];

        // 도로시맵
        int[][] mapR1 = new int[6][6];
        // 허수아비맵
        int[][] mapR3 = new int[6][6];
        // 양나맵
        int[][] mapR4 = new int[6][6];

        int value = 0;
        int color = 0;

        for (int i = 0; i < 6; i++) {
            for (int j = 0; j < 6; j++) {
                value = map[i][j] % 10;
                color = map[i][j] / 10;

                // 요소 저장
                if(value == 1){ // 출발점
                    mapR1[i][j] = map[i][j];
                    point[0] = i;
                    point[1] = j;
                }
                else if(value == 2){ // 도착점
                    mapR1[i][j] = map[i][j];
                    point[2] = i;
                    point[3] = j;
                }
                else if(value == 3){ // 구덩이
                    mapR3[i][j] = map[i][j];
                }
                else if(value == 4){ // 폭탄
                    mapR4[i][j] = map[i][j];
                }
                else if(value == 5){ // 열쇠
                    point[4] = i;
                    point[5] = j;
                }

                // 색 저장
                if(color == 1){
                    mapR1[i][j] = map[i][j];
                }
                else if (color == 2){
                    mapR3[i][j] = map[i][j];
                }
                else if (color == 3){
                    mapR4[i][j] = map[i][j];
                }
            }
        }

        // 사자 제외 만든맵 발행하는 메서드
        SendAid sendAidR1 = SendAid.builder()
                .aidMap(arrayToString(mapR1))
                .build();
        startAidPublisher(req, 1, sendAidR1);

        SendAid sendAidR3 = SendAid.builder()
                .aidMap(arrayToString(mapR3))
                .build();
        startAidPublisher(req, 3, sendAidR3);

        SendAid sendAidR4 = SendAid.builder()
                .aidMap(arrayToString(mapR4))
                .build();
        startAidPublisher(req, 4, sendAidR4);

        // 사자에게 갈 데이터 발행하는 메서드

        String[] directions = {"U", "D", "L", "R"};
        Random random = new Random();
        int randomIndex = random.nextInt(directions.length);
        String startDir = directions[randomIndex];
        String currentDir = startDir;

        int dx = Math.abs(point[0] - point[4]);
        int dy = Math.abs(point[1] - point[5]);
        int distKey = dx+dy;


        int nextCell = 0;
        switch (currentDir) {
            case "U":
                if(point[0] == 0){
                    nextCell = 0;
                } else{
                    nextCell = map[point[0]-1][point[1]];
                }
                break;
            case "D":
                if(point[0] == 5){
                    nextCell = 0;
                } else{
                    nextCell = map[point[0]+1][point[1]];
                }
                break;
            case "L":
                if(point[1] == 0){
                    nextCell = 0;
                } else{
                    nextCell = map[point[0]][point[1]-1];
                }
                break;
            case "R":
                if(point[1] == 5){
                    nextCell = 0;
                } else{
                    nextCell = map[point[0]][point[1]+1];
                }
                break;
            default:
                System.out.println("Invalid direction");
        }

        String nextScreen = "";
        if(nextCell<10){
            nextScreen = "wall";
        } else if(nextCell<20){
            nextScreen = "red";
        } else if(nextCell<30){
            nextScreen = "green";
        } else {
            nextScreen = "blue";
        }

        SendLion sendLion = SendLion.builder()
                .distanceKey(distKey)
                .screen(nextScreen)
                .build();
        // 사자에게 시작메시지 발행
        lionPublisher(req, sendLion);

        return Trap.builder()
                .round(findRound)
                .map(arrayToString(map))
                .turn(turn)
                .startLocation(point[0]+" "+point[1])
                .destinationLocation(point[2]+" "+point[3])
                .keyLocation(point[4]+" "+point[5])
                .startDirection(startDir)
                .allTrapLocation("11")  // 함정위치..
                .holeLocation("11")
                .bombLocation("12")
                .currentLocation(point[0]+" "+point[1])
                .currentDirection(currentDir)
                .hasKey((byte) 0)
                .build();

    }

    public int locationCheck(int curLocX, int curLocY, String map, byte hasKey){
        int[][] myMap = stringToArray(map);

        int result = 0;
        int value = myMap[curLocX][curLocY] % 10;

        if (hasKey == 0) { // 열쇠가 없을 때
            if(value == 5) {
                result = 1; // 열쇠 획득
            }
            else if(value == 3 || value == 4) {
                result = 3; // 함정
            }
        } else{ //열쇠가 있을 때
            if(value == 2){
                result = 2; // 도착
            } else if(value == 3 || value == 4){
                result = 3; // 함정
            }
        }

        // 0 pass, 1 열쇠획득, 2 도착, 3 함정
        return result;
    }


    public SendLion lionScreen(String map, int curLocX, int curLocY, String curDir, byte hasKey){
        int[][] myMap = stringToArray(map);

        int value = 0;
        int keyX = 0;
        int keyY = 0;
        for (int i = 0; i < 6; i++) {
            for (int j = 0; j < 6; j++) {
                value = myMap[i][j] % 10;
                if(value == 5){ // 열쇠
                    keyX = i;
                    keyY = j;
                }
            }
        }

        int dx = Math.abs(curLocX - keyX);
        int dy = Math.abs(curLocY - keyY);

        int nextCell = 0;
        switch (curDir) {
            case "U":
                if(curLocX == 0){
                    nextCell = 0;
                } else{
                    nextCell = myMap[curLocX-1][curLocY];
                }
                break;
            case "D":
                if(curLocX == 5){
                    nextCell = 0;
                } else{
                    nextCell = myMap[curLocX+1][curLocY];
                }
                break;
            case "L":
                if(curLocY == 0){
                    nextCell = 0;
                } else{
                    nextCell = myMap[curLocX][curLocY-1];
                }
                break;
            case "R":
                if(curLocY == 5){
                    nextCell = 0;
                } else{
                    nextCell = myMap[curLocX][curLocY+1];
                }
                break;
            default:
                System.out.println("Invalid direction");
        }

        String nextScreen = "";
        if(nextCell<10){
            nextScreen = "wall";
        } else if(nextCell<20){
            nextScreen = "red";
        } else if(nextCell<30){
            nextScreen = "green";
        } else {
            nextScreen = "blue";
        }

        int dist = dx+dy;

        SendLion sendLion = SendLion.builder()
                .distanceKey(dist)
                .screen(nextScreen)
                .hasKey(hasKey)
                .build();

        return sendLion;
    }


    // 역할마다 구분해서 보낼 게임시작 데이터
    public void startAidPublisher(TrapStartReq req, int userRole, SendAid data) {
        SocketMessage message = SocketMessage.builder()
                .rtcSession(req.getRtcSession())
                .message(userRole+"의 조력자 함정맵 전달")
                .type("trap/start/"+userRole)
                .data(data)
                .build();
        redisPublisher.publish(socketRepository.getTopic(message.getRtcSession()), message);
    }

    public void lionPublisher(TrapStartReq req, SendLion data){
        SocketMessage message = SocketMessage.builder()
                .rtcSession(req.getRtcSession())
                .message("사자 게임 시작")
                .type("trap/start/2")
                .data(data)
                .build();
        redisPublisher.publish(socketRepository.getTopic(message.getRtcSession()), message);
    }

    public void lionMovePublisher(LionMoveReq req, SendLion data){
        SocketMessage message = SocketMessage.builder()
                .rtcSession(req.getRtcSession())
                .message("사자 이동 결과")
                .userId(req.getUserId())
                .type("trap/move")
                .data(data)
                .build();
        redisPublisher.publish(socketRepository.getTopic(message.getRtcSession()), message);
    }

    public void publisher(LionMoveReq req, SendResult result){

        SocketMessage message = SocketMessage.builder()
                .rtcSession(req.getRtcSession())
                .message("")
                .type("trap/result")
                .data(result)
                .build();

        redisPublisher.publish(socketRepository.getTopic(message.getRtcSession()), message);
    }

    public static String arrayToString(int[][] arr) {
        StringBuilder sb = new StringBuilder();
        for (int[] row : arr) {
            for (int num : row) {
                sb.append(num).append(" ");
            }
            sb.append("\n");
        }
        return sb.toString();
    }

    public static int[][] stringToArray(String str) {
        String[] rows = str.trim().split("\n");
        int rowCount = rows.length;
        int colCount = rows[0].trim().split(" ").length;

        int[][] arr = new int[rowCount][colCount];

        for (int i = 0; i < rowCount; i++) {
            String[] cols = rows[i].trim().split(" ");
            for (int j = 0; j < colCount; j++) {
                arr[i][j] = Integer.parseInt(cols[j]);
            }
        }
        return arr;
    }


}
