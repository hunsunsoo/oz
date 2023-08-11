import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import style from "./RankPage.module.css";
import axiosInstance from "../../../_actions/axiosInstance";

function MyRanking({myRankList}) {
    const [rankList, setRankList] = useState([]);

    useEffect(() => {
        setRankList(myRankList);
    }, [myRankList]);

    return(
        <div className={style.myRankingContainer}>
            <div className={style.rankingTableContainer}>
                <table className={style.allRankTable}>
                    <colgroup>
                        <col style={{ width: "20%" }} /> {/* Rank 컬럼 */}
                        <col style={{ width: "40%" }} /> {/* 팀명 컬럼 */}
                        <col style={{ width: "40%" }} /> {/* 기록 컬럼 */}
                    </colgroup>
                    <thead className={style.allRankHead}>
                        <tr>
                            <th >Rank</th>
                            <th >팀명</th>
                            <th >기록</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            rankList.map((item) => {
                                console.log(item);
                                return (
                                    <tr className={style.allRankBody} key={item.rankId}>
                                        <td >{item.rank}</td>
                                        <td >{item.teamName}</td>
                                        <td >{item.time}</td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                    </table>
            </div>
        </div>
    )
}

function AllRank({allRankList}){
    const [rankList, setRankList] = useState([]);

    useEffect(()=> {
        setRankList(allRankList);
    }, [allRankList]);

    

    return(
        <div className={style.allRankingContainer}>
            <div className={style.rankingTableContainer}>
                <table className={style.allRankTable}>
                    <colgroup>
                        <col style={{ width: "20%" }} /> {/* Rank 컬럼 */}
                        <col style={{ width: "40%" }} /> {/* 팀명 컬럼 */}
                        <col style={{ width: "40%" }} /> {/* 기록 컬럼 */}
                    </colgroup>
                    <thead className={style.allRankHead}>
                        <tr>
                            <th >Rank</th>
                            <th >팀명</th>
                            <th >기록</th>
                        </tr>
                    </thead>
                </table>
                <div className={style.tableBodyDiv}>
                    <table className={style.allRankTable}>
                        <colgroup>
                            <col style={{ width: "20%" }} /> {/* Rank 컬럼 */}
                            <col style={{ width: "40%" }} /> {/* 팀명 컬럼 */}
                            <col style={{ width: "40%" }} /> {/* 기록 컬럼 */}
                        </colgroup>
                        <tbody>
                            {
                                rankList.map((item) => {
                                    console.log(item);
                                    return (
                                        <tr className={style.allRankBody} key={item.rankId}>
                                            <td >{item.rank <= 3 ? (
                                                    <img className={style.rankImage} src={process.env.PUBLIC_URL +`/image/rank/award_${item.rank}.png`} alt={`${item.rank}`} />
                                                ) : (
                                                    item.rank
                                                )}</td>
                                            <td >{item.teamName}</td>
                                            <td >{item.time}</td>
                                        </tr>
                                        
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

function RankPage(){
    const navigate = useNavigate();
    const [selectedStage, setSelectedStage] = useState(5);
    const [myRankList, setMyRankList] = useState([]);
    const [allRankList, setAllRankList] = useState([]);

    const handleButtonClick = (stage) => {
        setSelectedStage(stage); // 선택한 랭크 정보를 상태로 설정
    };

    const accessToken = useSelector(
        (state) => state.user.loginSuccess.headers.accesstoken
      );

    useEffect(()=> {
        axiosInstance
        .get(`/rank/${selectedStage}`, {
            headers: {
                AccessToken: accessToken,
            },
        })
        .then((response) => {
            setAllRankList(response.data.data.totalRankList || []);
            setMyRankList(response.data.data.myRankDtoList || []);
        })
    }, [selectedStage]);

    


    return(
        <div className={style.rankPage}>
            <button className={style.closeInputBox}
                onClick={() => navigate(`/`)}
                ><i class="fi fi-rr-left"></i>
            </button>
            <div className={style.buttonZone}>
                <button
                className={`${style.buttonNoneClick} ${selectedStage === 5 ? style.buttonClick : ''}`}
                onClick={() => handleButtonClick(5)}
                >5</button>
                <button className={`${style.buttonNoneClick} ${selectedStage === 1 ? style.buttonClick : ''}`}
                style={{left:'20%'}} onClick={() => handleButtonClick(1)}
                >1</button>
                <button 
                className={`${style.buttonNoneClick} ${selectedStage === 2 ? style.buttonClick : ''}`}
                style={{left:'40%'}} onClick={() => handleButtonClick(2)}>2</button>
                <button 
                className={`${style.buttonNoneClick} ${selectedStage === 3 ? style.buttonClick : ''}`}
                style={{left:'60%'}} onClick={() => handleButtonClick(3)}>3</button>
                <button 
                className={`${style.buttonNoneClick} ${selectedStage === 4 ? style.buttonClick : ''}`}
                style={{left:'80%'}} onClick={() => handleButtonClick(4)}>4</button>
            </div>
            <div className={style.rankDiv}>
                <div className={style.myTeamBlock}>
                    나의 팀 랭킹
                </div>
                <MyRanking myRankList={myRankList}/>
                <img className={style.rankBackImage} src={process.env.PUBLIC_URL +`/image/rank/rankingBack.png`}></img>
                <div className={style.line}></div>
                <div className={style.allTeamBlock}>
                    전체 랭킹
                </div>
                <AllRank allRankList={allRankList}/>
            </div>
        </div>
    )
}

export default RankPage;