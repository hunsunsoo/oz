package com.fire4bird.oz.record.repository;

import com.fire4bird.oz.record.entity.Record;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface RecordRepository extends JpaRepository<Record,Integer>,RecordRepositoryCustom {

    @Query(value = "select " +
            "    rank() over (order by min(re.acc_record)) as 'rank', " +
            "    t.team_name, " +
            "    min(re.acc_record) " +
            "from " +
            "    record re " +
            "        join round r on r.round_id = re.round_id " +
            "        join team t on t.team_id = r.team_id " +
            "where stage_num = 1 " +
            "group by t.team_name;", nativeQuery = true)
    List<Object[]> test();
}
