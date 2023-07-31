package com.fire4bird.oz;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class DeployTestController {

    @GetMapping("/test")
    public ResponseEntity deployTest() {
        return ResponseEntity.ok("ssl 인증서 테스트");
    }

    @GetMapping("/test2")
    public ResponseEntity deployTest2() {
        return ResponseEntity.ok("제발제발제발제발제발제발제발제발제발제발제발제발제발");
    }
}
