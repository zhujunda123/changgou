package com.changgou.goods.service.impl;

import com.changgou.goods.dao.BrandMapper;
import com.changgou.goods.pojo.Brand;
import com.changgou.goods.service.BrandService;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tk.mybatis.mapper.entity.Example;

import java.util.List;


@Service
public class BrandServiceImpl implements BrandService {

    @Autowired
    private BrandMapper brandMapper;

    /**
     * 全部数据
     *
     * @return
     */
    public List<Brand> findAll() {
        return brandMapper.selectAll();
    }

    /**
     * 根据ID查询
     *
     * @param id
     * @return
     */
    @Override
    public Brand findById(Integer id) {
        return brandMapper.selectByPrimaryKey(id);
    }

    /**
     * 增加
     *
     * @param brand
     */
    @Override
    public void add(Brand brand) {
        brandMapper.insert(brand);
    }

    /**
     * 修改
     *
     * @param brand
     */
    @Override
    public void update(Brand brand) {
        brandMapper.updateByPrimaryKey(brand);
    }

    /**
     * 删除
     *
     * @param id
     */
    @Override
    public void delete(Integer id) {
        brandMapper.deleteByPrimaryKey(id);
    }

    /***
     * 搜索数据
     * @param brand  根据brand参数搜索，如果brand指定属性为空，则不作为搜索条件，不为空，则作为搜索条件
     * @return
     */
    @Override
    public List<Brand> findList(Brand brand) {
        //创建Example
        Example example = createExample(brand);
        //动态条件搜索
        return brandMapper.selectByExample(example);
    }

    /***
     * 动态构建条件
     * @param brand
     * @return
     */
    public Example createExample(Brand brand){
        //动态构建条件  new Example(Brand.class);:操作指定对象，则写指定对象的字节码对象
        Example example = new Example(Brand.class);
        Example.Criteria criteria = example.createCriteria();

        if(brand!=null){
            //用户输入品牌名字  根据名字查询    where name like '%%'
            if(!StringUtils.isEmpty(brand.getName())){
                //1:搜索的JavaBean的属性名
                //2:对应的搜索参数
                criteria.andLike("name","%"+brand.getName()+"%");
            }

            //用户输入首字母    根据首字母查询   where letter=?
            if(!StringUtils.isEmpty(brand.getLetter())){
                //1:搜索的JavaBean的属性名
                //2:对应的搜索参数
                criteria.andEqualTo("letter",brand.getLetter());
            }
        }
        return example;
    }
    /**
     * 分页查询
     * @param page
     * @param size
     * @return
     */
    @Override
    public PageInfo<Brand> findPage(int page, int size){
        //静态分页
        PageHelper.startPage(page,size);
        //分页查询
        return new PageInfo<Brand>(brandMapper.selectAll());
    }

    @Override
    public PageInfo<Brand> findPage(Brand brand, int page, int size) {
        //分页查询
        PageHelper.startPage(page,size);
        //创建Example条件
        Example example = createExample(brand);
        //查询数据
        List<Brand> brands = brandMapper.selectByExample(example);
        //封装PageInfo
        return new PageInfo<Brand>(brands);
    }

    /***
     * 根据分类ID查询品牌集合
     * @param categoryid:分类ID
     * @return
     */
    @Override
    public List<Brand> findByCategory(Integer categoryid) {
        //1.查询当前分类所对应的所有品牌信息
        //2.根据品牌ID查询对应的品牌集合

        //自己创建DAO实现查询
        return brandMapper.findByCategory(categoryid);
    }

}

