package com.changgou.order.controller;

import com.changgou.order.feign.CartFeign;
import com.changgou.order.pojo.OrderItem;
import entity.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

@Controller
@RequestMapping("/wchart")
public class CartController {
    @Autowired
    private CartFeign cartFeign;
    @RequestMapping("/list")
    public  String list(Model model){
        Result<List<OrderItem>> result = cartFeign.list();
                model.addAttribute("items",result.getData());
                return "cart";
    }

    @ResponseBody
    @GetMapping(value = "/json/add")
    Result<List<OrderItem>> add(@RequestParam(value = "num")Integer num, @RequestParam(value = "id")Long id){

        Result result = cartFeign.add(num, id);
        Result<List<OrderItem>> CartResult = cartFeign.list();
        return  CartResult;
    }
}
