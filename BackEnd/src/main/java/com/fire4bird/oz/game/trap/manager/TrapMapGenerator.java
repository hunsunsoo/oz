package com.fire4bird.oz.game.trap.manager;

import lombok.extern.slf4j.Slf4j;

import java.util.Random;

@Slf4j
public class TrapMapGenerator {

    // 함정맵 생성
    static int[][] board = new int[6][6];
    static int[][] calculated;
    static boolean[][] visitedStartToKey;
    static boolean[][] visitedKeyToDestination;

    public static int[][] generateMap(){

        boolean validMap = false;
        while (!validMap) {
            for (int i = 0; i < 6; i++) {
                for (int j = 0; j < 6; j++) {
                    board[i][j] = 20;
                }
            }
            calculated = new int[6][6];

            addColorToRandomCells(10, 12);
            addColorToRandomCells(-10, 12);

            calculated = new int[6][6];
            addContentToRandomCells(1, 1);
            addContentToRandomCells(2, 1);
            addContentToRandomCells(3, 5);
            addContentToRandomCells(4, 5);
            addContentToRandomCells(5, 1);


            int startX = -1;
            int startY = -1;
            int keyX = -1;
            int keyY = -1;

            for (int i = 0; i < 6; i++) {
                for (int j = 0; j < 6; j++) {
                    if (board[i][j] % 10 == 1) {
                        startX = i;
                        startY = j;
                    } else if (board[i][j] % 10 == 5) {
                        keyX = i;
                        keyY = j;
                    }
                }
            }

            visitedStartToKey = new boolean[6][6];
            visitedKeyToDestination = new boolean[6][6];

            boolean canReachKey = findKeyPath(startX, startY);
            boolean canReachDestination = false;

            if(canReachKey){
                canReachDestination = findPathFromKeyToDestination(keyX, keyY);
            }
            validMap = canReachKey && canReachDestination;
        }

        return board;
    }

    public static void addColorToRandomCells(int value, int numCells) {
        Random rand = new Random();
        int count = 0;

        while (count < numCells) {
            int row = rand.nextInt(6);
            int col = rand.nextInt(6);

            if (calculated[row][col] == 0) {
                board[row][col] += value;
                calculated[row][col] += 1;
                count++;
            }
        }
    }

    public static void addContentToRandomCells(int value, int numCells) {
        Random rand = new Random();
        int count = 0;

        while (count < numCells) {
            int row = rand.nextInt(6);
            int col = rand.nextInt(6);

            if (calculated[row][col] == 0) {
                board[row][col] += value;
                calculated[row][col] += 1;
                count++;
            }
        }
    }

    // dfs - 유효한 맵인지 검증
    public static boolean findKeyPath(int x, int y) {
        if (x < 0 || x >= 6 || y < 0 || y >= 6 || visitedStartToKey[x][y]) {
            return false;
        }

        int value = board[x][y];

        visitedStartToKey[x][y] = true;

        if (value % 10 == 5) { // 열쇠인 경우
            return true;
        }

        if (value % 10 == 3 || value % 10 == 4) { // 함정인 경우
            return false;
        }

        boolean foundPath = findKeyPath(x + 1, y) || findKeyPath(x - 1, y) ||
                findKeyPath(x, y + 1) || findKeyPath(x, y - 1);

        return foundPath;
    }

    public static boolean findPathFromKeyToDestination(int x, int y) {
        if (x < 0 || x >= 6 || y < 0 || y >= 6 || visitedKeyToDestination[x][y]) {
            return false;
        }

        visitedKeyToDestination[x][y] = true;
        int value = board[x][y];

        if (value % 10 == 2) { // 도착점인 경우
            return true;
        }

        if (value % 10 == 3 || value % 10 == 4) { // 함정인 경우
            return false;
        }


        boolean foundPath = findPathFromKeyToDestination(x + 1, y) || findPathFromKeyToDestination(x - 1, y) ||
                findPathFromKeyToDestination(x, y + 1) || findPathFromKeyToDestination(x, y - 1);

        return foundPath;
    }

    public static int[][] screenMapGenerator(int[][] map){
        // red 1,2,3,4 / blue 5,6,7,8 / green 9, 10, 11, 12
        int[][] screenMap = new int[6][6];
        int rCount = 0;
        int gCount = 0;
        int bCount = 0;
        int value = 0;
        for (int i = 0; i < 6; i++) {
            for (int j = 0; j < 6; j++) {
                value = map[i][j] / 10;

                if(value == 1){ // 빨강
                    if(rCount == 0) {
                        screenMap[i][j] = 1;
                        rCount++;
                    } else if(rCount == 1){
                        screenMap[i][j] = 2;
                        rCount++;
                    } else if(rCount == 2){
                        screenMap[i][j] = 3;
                        rCount++;
                    } else if(rCount == 3){
                        screenMap[i][j] = 4;
                        rCount = 0;
                    }
                } else if(value == 2){ // 초록
                    if(gCount == 0) {
                        screenMap[i][j] = 5;
                        gCount++;
                    } else if(gCount == 1){
                        screenMap[i][j] = 6;
                        gCount++;
                    } else if(gCount == 2){
                        screenMap[i][j] = 7;
                        gCount++;
                    } else if(gCount == 3){
                        screenMap[i][j] = 8;
                        gCount = 0;
                    }
                } else if(value == 3) { // 파랑
                    if(bCount == 0) {
                        screenMap[i][j] = 9;
                        bCount++;
                    } else if(bCount == 1){
                        screenMap[i][j] = 10;
                        bCount++;
                    } else if(bCount == 2){
                        screenMap[i][j] = 11;
                        bCount++;
                    } else if(bCount == 3){
                        screenMap[i][j] = 12;
                        bCount = 0;
                    }
                }
            }
        }

        return screenMap;
    }
}
