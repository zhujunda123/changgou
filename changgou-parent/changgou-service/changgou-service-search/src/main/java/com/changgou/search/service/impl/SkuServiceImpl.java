package com.changgou.search.service.impl;

import com.alibaba.fastjson.JSON;
import com.changgou.goods.feign.SkuFeign;
import com.changgou.goods.pojo.Sku;
import com.changgou.search.dao.SkuEsMapper;
import com.changgou.search.pojo.SkuInfo;
import com.changgou.search.service.SkuService;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.common.text.Text;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.SearchHit;
import org.elasticsearch.search.aggregations.Aggregation;
import org.elasticsearch.search.aggregations.AggregationBuilders;
import org.elasticsearch.search.aggregations.Aggregations;
import org.elasticsearch.search.aggregations.bucket.terms.StringTerms;
import org.elasticsearch.search.fetch.subphase.highlight.HighlightBuilder;
import org.elasticsearch.search.fetch.subphase.highlight.HighlightField;
import org.elasticsearch.search.sort.SortBuilders;
import org.elasticsearch.search.sort.SortOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.core.ElasticsearchTemplate;
import org.springframework.data.elasticsearch.core.SearchResultMapper;
import org.springframework.data.elasticsearch.core.aggregation.AggregatedPage;
import org.springframework.data.elasticsearch.core.aggregation.impl.AggregatedPageImpl;
import org.springframework.data.elasticsearch.core.query.NativeSearchQuery;
import org.springframework.data.elasticsearch.core.query.NativeSearchQueryBuilder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.*;
import java.util.stream.Collectors;

/*****
 * @Author: www.itheima.com
 * @Description: com.changgou.search.service.impl
 ****/
@Service
public class SkuServiceImpl implements SkuService {

    @Autowired
    private SkuFeign skuFeign;

    @Autowired
    private SkuEsMapper skuEsMapper;



    /***
     * 搜索实现
     * @param searchMap:用户的搜索条件
     *                   关键字搜索  key=keywords
     * @return
     */
    @Autowired
    private ElasticsearchTemplate esTemplate;

    /**
     * 搜索数据
     * @param searchMap
     * @return
     */
    @Override
    public Map search(Map<String, String> searchMap) {
        //1.条件构建
        NativeSearchQueryBuilder builder = buildBasicQuery(searchMap);

        //2.搜索列表
        Map resultMap = searchList(builder);

        //分组搜索
        List<String> categoryList = searchCategoryList(builder);
        resultMap.put("categoryList",categoryList);

        //4.查询分类对应的品牌
        List<String> brandList = searchBrandList(builder);
        resultMap.put("brandList",brandList);

        //5.查询规格数据
        Map<String, Set<String>> specMap = searchSpec(builder);
        resultMap.put("specList",specMap);

        return resultMap;


    }
    /**
     * 查询规格列表
     * @param queryBuilder
     * @return
     */
    public Map<String, Set<String>> searchSpec(NativeSearchQueryBuilder queryBuilder) {
        //查询聚合品牌  skuBrandGroupby给聚合分组结果起个别名
        String skuSpec = "skuSpec";
        queryBuilder.addAggregation(AggregationBuilders.terms(skuSpec).field("spec.keyword"));

        //执行搜索
        AggregatedPage<SkuInfo> result = esTemplate.queryForPage(queryBuilder.build(), SkuInfo.class);
        //获取聚合规格数据结果
        Aggregations aggs = result.getAggregations();
        //获取分组结果
        StringTerms terms = aggs.get(skuSpec);

        //返回规格数据名称
        List<String> sku_specList = terms.getBuckets().stream().map(b -> b.getKeyAsString()).collect(Collectors.toList());

        //将规格转成Map
        Map<String, Set<String>> specMap = specPutAll(sku_specList);
        return specMap;
    }
    /***
     * 将所有规格数据转入到Map中
     * @param specList
     * @return
     */
    public Map<String,Set<String>> specPutAll(List<String> specList){
        //新建一个Map
        Map<String,Set<String>> specMap = new HashMap<String,Set<String>>();

        //将集合数据存入到Map中
        for (String specString : specList) {
            //将Map数据转成Map
            Map<String,String> map = JSON.parseObject(specString, Map.class);

            //循环转换后的Map
            for (Map.Entry<String, String> entry : map.entrySet()) {
                String key = entry.getKey();        //规格名字
                String value = entry.getValue();    //规格选项值
                //获取当前规格名字对应的规格数据
                Set<String> specValues = specMap.get(key);
                if(specValues==null){
                    specValues = new HashSet<String>();
                }
                //将当前规格加入到集合中
                specValues.add(value);
                //将数据存入到specMap中
                specMap.put(key,specValues);
            }
        }
        return  specMap;
    }
    /**
     * 查询品牌列表
     * @param queryBuilder
     * @return
     */
    public List<String> searchBrandList(NativeSearchQueryBuilder queryBuilder) {
        //查询聚合品牌  skuBrandGroupby给聚合分组结果起个别名
        String skuBrand = "skuBrand";
        queryBuilder.addAggregation(AggregationBuilders.terms(skuBrand).field("brandName"));

        //执行搜索
        AggregatedPage<SkuInfo> result = esTemplate.queryForPage(queryBuilder.build(), SkuInfo.class);
        //获取聚合品牌结果
        Aggregations aggs = result.getAggregations();
        //获取分组结果
        StringTerms terms = aggs.get(skuBrand);

        //返回品牌名称
        List<String> sku_brandList = terms.getBuckets().stream().map(b -> b.getKeyAsString()).collect(Collectors.toList());
        return sku_brandList;
    }


//    /***
//     * 数据搜索
//     * @param builder
//     * @return
//     */
//    private Map searchList(NativeSearchQueryBuilder builder){
//        Map resultMap=new HashMap();//返回结果
//        //查询解析器
//        NativeSearchQuery searchQuery = builder.build();
//        Page<SkuInfo> skuPage =  esTemplate.queryForPage(searchQuery,SkuInfo.class);
//
//        //存储对应数据
//        resultMap.put("rows",skuPage.getContent());
//        resultMap.put("totalPages",skuPage.getTotalPages());
//        return resultMap;
//    }
    /***
     * 数据搜索
     * @param builder
     * @return
     */
    private Map searchList(NativeSearchQueryBuilder builder){
        Map resultMap=new HashMap();//返回结果
        //高亮域配置
        HighlightBuilder.Field field = new HighlightBuilder.
                Field("name").                      //指定的高亮域
                preTags("<span style=\"color:red\">").   //前缀
                postTags("</span>").                      //后缀
                fragmentSize(100);

        //添加高亮域
        builder.withHighlightFields(field);

        NativeSearchQuery searchQuery = builder.build();
        //分页搜索
        AggregatedPage<SkuInfo> skuPage = esTemplate.queryForPage(searchQuery, SkuInfo.class, new SearchResultMapper() {
            @Override
            public <T> AggregatedPage<T> mapResults(SearchResponse response, Class<T> clazz, Pageable pageable) {
                //定义一个集合存储所有高亮数据
                List<T> list = new ArrayList<T>();

                //循环所有数据
                for (SearchHit hit : response.getHits()) {
                    //获取非高亮数据           例如：小白真美丽      {"name":"张三","age":27}
                    SkuInfo skuInfo = JSON.parseObject(hit.getSourceAsString(), SkuInfo.class);

                    //获取高亮数据            例如：小白真 <span style="color:red;">美丽</span>
                    HighlightField titleHighlight = hit.getHighlightFields().get("name");      //获取标题的高亮数据

                    if (titleHighlight != null) {
                        //定义一个字符接收高亮数据
                        StringBuffer buffer = new StringBuffer();
                        //循环获取高亮数据
                        for (Text text : titleHighlight.getFragments()) {
                            //text.toString():   小白真<span style="color:red;">美丽</span>啊
                            buffer.append(text.toString());
                        }
                        //将非高亮数据替换成高亮数据    小白真美丽-->小白真 <span style="color:red;">美丽</span>
                        skuInfo.setName(buffer.toString());
                    }

                    //将高亮数据返回
                    list.add((T) skuInfo);
                }
                //1：返回的集合数据   2：分页数据   3：总记录数
                return new AggregatedPageImpl<T>(list, pageable, response.getHits().getTotalHits());
            }
        });

        resultMap.put("rows",skuPage.getContent());
        resultMap.put("totalPages",skuPage.getTotalPages());
        return resultMap;
    }
    /**
     * 构建基本查询
     * @param searchMap
     * @return
     */
    private NativeSearchQueryBuilder buildBasicQuery(Map<String,String> searchMap) {
        // 查询构建器
        NativeSearchQueryBuilder nativeSearchQueryBuilder = new NativeSearchQueryBuilder();

        //构建布尔查询
        BoolQueryBuilder queryBuilder = QueryBuilders.boolQuery();

        //条件组装
        if(searchMap!=null){
            //关键词
            if(!StringUtils.isEmpty(searchMap.get("keywords"))){
                queryBuilder.must(QueryBuilders.matchQuery("name",searchMap.get("keywords")));
            }

            //分类筛选
            if(!StringUtils.isEmpty(searchMap.get("category"))){
                queryBuilder.must(QueryBuilders.matchQuery("categoryName",searchMap.get("category")));
            }

            //品牌
            if(!StringUtils.isEmpty(searchMap.get("brand"))){
                queryBuilder.must(QueryBuilders.termQuery("brandName",searchMap.get("brand")));
            }
            //规格
            for(String key:searchMap.keySet()){
                //如果是规格参数
                if(key.startsWith("spec_")){
                    queryBuilder.must(QueryBuilders.matchQuery("specMap."+key.substring(5)+".keyword", searchMap.get(key)));
                }
            }
            //价格区间过滤
            String price = searchMap.get("price");
            if(!StringUtils.isEmpty(price)){
                //根据-分割
                String[] array = price.split("-");
                //x<price
                queryBuilder.must(QueryBuilders.rangeQuery("price").gt(array[0]));
                if(array.length==2){
                    //price<=y
                    queryBuilder.must(QueryBuilders.rangeQuery("price").lte(array[1]));
                }
            }
            //排序实现
            String sortRule=searchMap.get("sortRule");//排序规则 ASC  DESC
            String sortField=searchMap.get("sortField");//排序字段  price
            if(!StringUtils.isEmpty(sortField)){
                nativeSearchQueryBuilder.withSort(SortBuilders.fieldSort(sortField).order(SortOrder.valueOf(sortRule)));
            }
        }
        //分页
        Integer pageNo =pageConvert(searchMap);//页码
        Integer pageSize = 3;//页大小
        PageRequest pageRequest = PageRequest.of( pageNo- 1, pageSize);
        nativeSearchQueryBuilder.withPageable(pageRequest);

        //添加过滤
        nativeSearchQueryBuilder.withQuery(queryBuilder);
        return nativeSearchQueryBuilder;
    }
    /***
     * 获取当前页
     * 如果不发生异常，则直接转换成数字
     * 如果发生异常，则默认从第1页查询
     * @param searchMap
     * @return
     */
    public Integer pageConvert(Map<String,String> searchMap){
        try {
            return Integer.parseInt(searchMap.get("pageNum"));
        } catch (Exception e) {
        }
        return 1;
    }

    /***
     * 调用商品微服务，查询商品数据
     * 并且将商品数据导入到ES索引库中
     */
    @Override
    public void importSku() {
        //1.先查询List<Sku>
        List<Sku> skuList = skuFeign.findByStatus("1");

        //2.将List<Sku>转换成List<SkuInfo>
        String skuJson = JSON.toJSONString(skuList);  //{"name":"xxx","price":2345}
        List<SkuInfo> skuInfoList =JSON.parseArray(skuJson,SkuInfo.class) ;

        //3.将spec规格转换成Map，赋值给specMap
        for (SkuInfo skuInfo : skuInfoList) {
            //获取规格
            String specJson = skuInfo.getSpec();
            //并将规格转成Map
            Map<String,Object> specMap = JSON.parseObject(specJson, Map.class);
            //将Map赋值给specMap
            skuInfo.setSpecMap(specMap);
        }

        //4.使用SpringData ElasticSearch 实现数据批量导入索引库
        skuEsMapper.saveAll(skuInfoList);
    }
    /***
     * 搜索分类分组数据
     */
    public List<String> searchCategoryList(NativeSearchQueryBuilder builder){
        /***
         * 指定分类域，并根据分类域配置聚合查询
         * 1:给分组查询取别名
         * 2:指定分组查询的域
         */
        builder.addAggregation(AggregationBuilders.terms("skuCategory").field("categoryName"));

        //执行搜索
        AggregatedPage<SkuInfo> skuPage = esTemplate.queryForPage(builder.build(), SkuInfo.class);

        //获取所有分组查询的数据
        Aggregations aggregations = skuPage.getAggregations();

        //从所有数据中获取别名为skuCategory的数据
        StringTerms terms = aggregations.get("skuCategory");

        //分装List集合，将搜索结果存入到List集合中
        List<String> categoryList = new ArrayList<String>();
        for (StringTerms.Bucket bucket : terms.getBuckets()) {
            categoryList.add(bucket.getKeyAsString());
        }
        return categoryList;
    }
}
