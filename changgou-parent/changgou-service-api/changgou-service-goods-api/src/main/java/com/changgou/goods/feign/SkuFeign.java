

package com.changgou.goods.feign;

import com.changgou.goods.pojo.Sku;
import entity.Result;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/*****
 * @Author: www.itheima.com
 * @Description: com.changgou.goods.feign
 * 1.指定当前Feign调用的远程服务名字
 ****/
@FeignClient(value = "goods")   //跟商品微服务的服务名字保持一致
@RequestMapping(value = "/sku")
public interface SkuFeign {
    /***
     * 根据ID查询SKU信息
     * @param id : sku的ID
     */
    @GetMapping(value = "/{id}")
    public Result<Sku> findById(@PathVariable(value = "id", required = true) Long id);

    /***
     * 根据审核状态查询Sku
     * @param status
     * @return
     */
    @GetMapping(value = "/status/{status}")
    List<Sku> findByStatus(@PathVariable(value = "status")String status);


    /***
     * 多条件搜索品牌数据
     * @param sku
     * @return
     */
    @PostMapping(value = "/search" )
    Result<List<Sku>> findList(@RequestBody(required = false)  Sku sku);

    /***
     * 库存递减
     * @param username
     * @return
     */
    @PostMapping(value = "/decr/count")
    Result decrCount(@RequestParam(value = "username") String username);
}
