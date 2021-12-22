package backend.hobbiebackend.web;


import backend.hobbiebackend.model.entities.Test;
import backend.hobbiebackend.service.TestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.persistence.Access;

@RestController
@RequestMapping("/test")
@CrossOrigin(origins = "http://localhost:4200")
public class TestController {

    private final TestService testService;


    @Autowired
    public TestController(TestService testService) {
        this.testService = testService;
    }




    @PostMapping("/results")
    public void saveTestResults(@RequestBody Test results) {
     this.testService.saveTestResults(results);
    }

}
