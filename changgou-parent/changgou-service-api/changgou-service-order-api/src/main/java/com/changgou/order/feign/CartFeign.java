package com.changgou.order.feign;

import com.changgou.order.pojo.OrderItem;
import entity.Result;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@FeignClient(name = "order")
@RequestMapping("/cart")
public interface CartFeign {
    @GetMapping("/list")
    Result<List<OrderItem>>list();
    @GetMapping("/add")
    Result add(@RequestParam(value = "num")Integer num,@RequestParam(value = "id")Long id);
}
