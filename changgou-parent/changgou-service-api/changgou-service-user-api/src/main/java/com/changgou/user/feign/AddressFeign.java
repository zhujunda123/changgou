package com.changgou.user.feign;

import com.changgou.user.pojo.Address;
import entity.Result;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@FeignClient(name="user")
@RequestMapping("/address")
public interface AddressFeign {

    /***
     * 查询用户的收件地址信息
     * @return
     */
    @GetMapping(value = "/list")
    Result<List<Address>> list();
}