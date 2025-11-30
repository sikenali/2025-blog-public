## 准备工作

1、下载源码仓库：git clone https://gitee.com/fzlrkj/docker2lzc

2、下载并安装Trae IDE，官网地址：https://www.trae.com.cn

> 中国区免费的，更加适合国人使用，国际版-http://trae.ai 需要付费，更加强大


## 软件界面

1、开Trae IDE，切换到SOLO模式，打开文件夹导入上述源码仓库目录（源码右侧显示）；

![](/blogs/dtolpk-tool/84eca554d41f2365.png)

> 如果软件功能和需求不明确， 建议勾选Plan， 在自动编码之前生成开发计划md文件， 可对其进行修改，如UI框架、编程语言、主题颜色、界面布局、导航菜单等。

2、在软件界面SOLO Coder 对话框下，输入prompt；

> 例如：我是一名Linux社区的工程师，现需要根据已有仓库源码开发一款名为DTOLPK的软件，请根据现有仓库的源码分析其功能点，将命令行模式转化成图形化界面实现所有功能，请通过以下方式帮我完成所有界面的原型设计(说明：如果需要UI设计更加精细，可以通过原型或草图使用 [stitch](https://stitch.withgoogle.com/) 工具生成，并将其上传Trae solo对话框中作为图片附件。)，并确保这些原型界面可以直接用于开发：

> 用户体验分析：先分析这个源码的主要功能和用户需求，确定核心交互逻辑。   * 产品界面规划：作为产品经理，定义关键界面，确保信息架构合理。   * 高保真 UI 设计：作为 UI 设计师，设计贴近真实 PC 设计规范的界面，使用现代化的 UI 元素，使其具有良好的视觉体验。   * 原型实现：使用 HTML + Tailwind CSS（或 Bootstrap）生成所有原型界面，并使用 FontAwesome（或其他开源 UI 组件）让界面更加精美、接近真实的 App 设计。拆分代码文件，保持结构清晰。


![](/blogs/dtolpk-tool/383595435edc81a7.png)

3、开发计划生成或修改完成后，按照提示对计划进行todo分解，进入自动编码阶段；

![](/blogs/dtolpk-tool/12f999f6e56276f6.png)

4、在开发完成后，可对界面进行预览或打包本地程序运行；

5、在软件界面操作过程中，根据界面报错或日志信息（如浏览器F12），提供给SOLO Coder进行修复或优化；

6、此外，可提供额外的要求如URL，工具自动获取链接中的内容进行分析，完善软件功能；

>  在界面操作生成的过程中报错或需要丰富功能，请参考官方文档要求，使其界面化工具进一步优化。例如：[移植应用](https://developer.lazycat.cloud/app-example-porting.html) 和 [推送官方仓库](https://developer.lazycat.cloud/publish-app.html) 以及 [开发测试镜像](https://developer.lazycat.cloud/advanced-dev-image.html)。

7、同时，根据要求可生成的程序架构，如Electron架构或Web docker部署；

8、直到按照最终确定的需求，实现软件所有的功能。



## DTOLPK软件

通过Trae SOLO Coder工具自动编程开发的软件主要功能模块如下：

### 应用信息

![](/blogs/dtolpk-tool/e36b8ef6f9e4ceb9.png)

### 应用功能

![](/blogs/dtolpk-tool/941bb6d7bd6f4cf6.png)

### 资源配置

![](/blogs/dtolpk-tool/c745e124c0602fa2.png)

### 路由配置

![](/blogs/dtolpk-tool/5d51cfe2b7fcc33f.png)
 
### 镜像配置

![](/blogs/dtolpk-tool/921b190134dd188b.png)
  
### 构建配置

![](/blogs/dtolpk-tool/fa473a0fc456eea5.png)
   
### 高级配置

![](/blogs/dtolpk-tool/aa8b7b85eb00a367.png)
    
### 生成 LPK

![](/blogs/dtolpk-tool/17f55d6af1250f76.png)

>  注：由于本软件完全基于Trae SOLO Coder工具生成，故可能存在不确定的功能稳定性以及Bug，还未深度测试验证其功能的可靠性，将持续改进优化，请谨慎使用~

## 打包实践

> 如：https://github.com/tsxcw/mtab


1、将生成lpk文件（如：cloud.lazycat.app.mtab.lpk）上传到懒猫微服（懒猫网盘中）；

![](/blogs/dtolpk-tool/07e6ca3712f770aa.png)

> 没有设备咋办，买一台后打包上架一个应用100元，此款工具就成为挣钱回本利器了。哈哈！！

2、在懒猫网盘中点击安装lpk文件；

![](/blogs/dtolpk-tool/2a368a1305f3c54f.png)

3、切换至懒猫微服客户端，可以看到刚安装的应用；

![](/blogs/dtolpk-tool/79637fb15c9270ce.png)

> 如果安装成功后，出现小绿点表示启动正常

4、 点击图标即可打开软件，查看软件运行成功。

![](/blogs/dtolpk-tool/7227a3bd8ff0ed47.png)

> 这样就可以愉快的去网上找些开源应用进行打包玩耍啦~~~


项目地址：[DTOLPK](https://github.com/sikenali/DTOLPK)

