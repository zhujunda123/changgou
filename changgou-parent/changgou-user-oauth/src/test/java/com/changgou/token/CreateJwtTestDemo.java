package com.changgou.token;

import com.alibaba.fastjson.JSON;
import org.junit.Test;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.security.jwt.Jwt;
import org.springframework.security.jwt.JwtHelper;
import org.springframework.security.jwt.crypto.sign.RsaSigner;
import org.springframework.security.jwt.crypto.sign.RsaVerifier;
import org.springframework.security.oauth2.provider.token.store.KeyStoreKeyFactory;

import java.security.KeyPair;
import java.security.PrivateKey;
import java.security.interfaces.RSAPrivateKey;
import java.util.HashMap;
import java.util.Map;

/*****
 * @Author: www.itheima.com
 * @Description: com.changgou.token
 ****/
public class CreateJwtTestDemo {


    /***
     * 用私钥创建令牌数据
     */
    @Test
    public void testCreateJwt(){
        //秘钥->私钥
        Resource resource = new ClassPathResource("changgou64.jks");

        /***
         * 加载证书,读取证书数据
         * 1:证书对象
         * 2:证书的密码
         */
        KeyStoreKeyFactory keyStoreKeyFactory = new KeyStoreKeyFactory(resource,"changgou64".toCharArray());

        //把私钥信息当做秘钥
        KeyPair keyPair = keyStoreKeyFactory.getKeyPair("changgou64","changgou64".toCharArray());
        PrivateKey privateKey = keyPair.getPrivate();
        RSAPrivateKey rsaPrivateKey = (RSAPrivateKey) privateKey;
        //并指定加密算法
        RsaSigner rsaSigner = new RsaSigner(rsaPrivateKey);

        //添加载荷数据 payload
        Map<String,String> map = new HashMap<String,String>();
        map.put("username","王五");
        map.put("address","中南海");

        //生成令牌 JwtHelper生成令牌/解析令牌
        Jwt jwt = JwtHelper.encode(JSON.toJSONString(map), rsaSigner);
        System.out.println(jwt.getEncoded());
    }


    /***
     * 令牌解密
     */
    @Test
    public void testParse(){
        String encode = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZGRyZXNzIjoi5Lit5Y2X5rW3IiwidXNlcm5hbWUiOiLnjovkupQifQ.cwb4Re26_I6h9PM7u_BMhX_Fyjuvu4nvn7xpoHH9v1v7Z3efFhH_PlLfGdPzZrwm2GBikz3PSxmJSM2nj1KfIxOhnBeCjUhExqGwigB9D5BRmMDuT_ifCgiOxiMq-wuHIEyfQ6q3pKvpP7o2loHRpHewca0IiOT42yBM2XRfDfn5qkCYy3EONMe6HvTMurSVJDbVfixn5VE_iVAMq7Bcot6MXUCtm4hlXE9CrAcqRB74DlBM6xDaBzXyPEXmaArkp69WQ1u6pOamDoo1B8F7HY7HIATRMAOTT52DK0EVboMY1vehnj99yjgzHsD0tPSDjO_KPlzICkbufiTNQWzgYw";
        String key = "-----BEGIN PUBLIC KEY-----MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAiiTUGUUsWd1hIf++wZzUq099cZBWXncr3hvvONUhlBVvSy7cY5wz9Uw1KHMxDjSrMX9UIrD09NprfieZgWIrowBhO5sU8YJ08sFncUsdV/02yPOdCyEIEFaI7ezYECNfkgxz+o9dBzlknhThXmAlFnIDuDHkccJ6a+pn7JgAP9QVyrNlwNv0TzQxclso177rVZx+K6HPl5+4DJNMFziCC1+PiwfRM5EPGkDoI1b77o5XElTYhI5gTH4n6uHKuRqDdlv+NHcJs+JesqJ/IEdGp6d0ICzbD9jb0/awscCA5jX6Xv4xYj4BwlJzRaXNSreGtyMVN11Cq+GyXVM2rKrMUwIDAQAB-----END PUBLIC KEY-----";

        //创建RsaVerifier对象，用于加载公钥，将它作为秘钥
        RsaVerifier rsaVerifier = new RsaVerifier(key);
        //JwtHelper.decodeAndVerify("令牌","公钥加载，并且指定算法");
        Jwt jwt = JwtHelper.decodeAndVerify(encode, rsaVerifier);
        System.out.println(jwt.getClaims());
    }

}
