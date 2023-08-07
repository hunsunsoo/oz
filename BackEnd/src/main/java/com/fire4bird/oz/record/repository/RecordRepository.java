package com.fire4bird.oz.record.repository;

import com.fire4bird.oz.record.entity.Record;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RecordRepository extends JpaRepository<Record,Integer>,RecordRepositoryCustom {
}
