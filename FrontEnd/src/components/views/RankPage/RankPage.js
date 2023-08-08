import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import style from "./RankPage.module.css";

const dummyLanking = [
    {
        stage: 1,
        teamName: "불사조",
        record: "30분 13초"
    },
    {
        stage: 1,
        teamName: "불사조1",
        record: "30분 15초"
    },
    {
        stage: 1,
        teamName: "불사조2",
        record: "30분 29초"
    }
]
function MyRanking() {
    const [Stage, setStage] = useState(5);
    const [TeamName, setTeamName] = useState("");
    const [Record, setRecord] = useState("");

    // const accessToken = useSelector(
    //     (state) => state.user.loginSuccess.headers.accessToken
    // );
    const onStageHandler = (newStage) => setStage(newStage);

    useEffect(() => {
        // console.log(accessToken);
        // -> 로그인된 유저 팀 랭킹 불러오기
    })

    return(
        <div className={style.myRankingContainer}>
            <div className={style.image}>
            </div>
            <div className={style.myTeamBlock}>
                나의 팀 랭킹
            </div>
        </div>
    )
}

function AllRank(){
    const [rankList, setRankList] = useState([]);
    return(
        <div className={style.allRankingContainer}>
            <div className={style.allTeamBlock}>
                전체 랭킹
            </div>
            <table>
                <thead>
                    <tr align>
                        <th >Rank</th>
                        <th >팀명</th>
                        <th >기록</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td >1</td>
                        <td >불사조</td>
                        <td >30분 몇 초</td>
                    </tr>
                    <tr>
                        <td >2</td>
                        <td >불사조1</td>
                        <td >30분</td>
                    </tr>
                    <tr>
                        <td >3</td>
                        <td >불사조2</td>
                        <td >30분</td>
                    </tr>
                    <tr>
                        <td >4</td>
                        <td >불사조</td>
                        <td >30분</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

function RankPage(){
    return(
        <div className={style.rankPage}>
            <div className={style.rankDiv}>
                <MyRanking/>
                <AllRank/>
            </div>
        </div>
    )
}

export default RankPage;