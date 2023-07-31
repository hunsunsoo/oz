package com.fire4bird.oz;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DeployTestController {

    @GetMapping("/")
    public ResponseEntity deployTest() {
        return ResponseEntity.ok("제발 쫌... 이제 되는거지??");
    }
}
