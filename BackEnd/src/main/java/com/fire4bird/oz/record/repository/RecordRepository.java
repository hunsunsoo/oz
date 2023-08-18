package com.fire4bird.oz.record.repository;

import com.fire4bird.oz.record.entity.Record;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RecordRepository extends JpaRepository<Record, Integer>, RecordRepositoryCustom {

    @Query(value = "select " +
            "    rank() over (order by min(re.acc_record)) as 'rank', " +
            "    t.team_name, " +
            "    min(re.acc_record) " +
            "from " +
            "    record re " +
            "        join round r on r.round_id = re.round_id " +
            "        join team t on t.team_id = r.team_id " +
            "where stage_num = :stageNum AND " +
            "       clear = 'clear'" +
            "group by t.team_name " +
            "limit 10;", nativeQuery = true)
    List<Object[]> findTotalRankTest(@Param("stageNum") int stageNum);

    @Query(value = "WITH TeamRanking AS ( " +
            "    SELECT " +
            "        rank() OVER (ORDER BY MIN(re.acc_record)) AS 'rank', " +
            "        t.team_name, " +
            "        t.team_id, " +
            "        min(re.acc_record) AS 'min_record' " +
            "    FROM record re " +
            "             JOIN round r ON r.round_id = re.round_id " +
            "             JOIN team t ON t.team_id = r.team_id" +
            "    WHERE re.stage_num = :stageNum AND re.clear = 'clear' " +
            "    GROUP BY t.team_name,t.team_id " +
            ")\n" +
            "SELECT tr.rank, " +
            "       tr.team_name, " +
            "       min(tr.min_record) " +
            "FROM TeamRanking tr " +
            "         JOIN round r ON tr.team_id = r.team_id " +
            "         JOIN user_round ur ON r.round_id = ur.round_id " +
            "WHERE ur.user_id = :userId " +
            "group by tr.rank, tr.team_name, ur.user_id " +
            "ORDER BY tr.rank " +
            "limit 3;", nativeQuery = true)
    List<Object[]> findMyRankTest(@Param("userId") int userId,
                                  @Param("stageNum") int stageNum);
}
