package com.changgou.order.controller;

import com.changgou.order.feign.CartFeign;
import com.changgou.order.pojo.OrderItem;
import com.changgou.user.feign.AddressFeign;
import com.changgou.user.pojo.Address;
import entity.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@Controller
@CrossOrigin
@RequestMapping("/worder")
public class OrderController {
    @Autowired
    private AddressFeign addressFeign;
    @Autowired
    private CartFeign cartFeign;

    @RequestMapping(value = "/ready/order")
    public String readyOrder(Model model) {
        Result<List<Address>> address = addressFeign.list();
        Result<List<OrderItem>> carts = cartFeign.list();
        model.addAttribute("address", address.getData());
        model.addAttribute("cates", carts.getData());
        for (Address addr :address.getData() ) {
            if(addr.getIsDefault().equals("1")){
                model.addAttribute("deAddr",addr);
                break;
            }

        }
        return "order";
    }
}
