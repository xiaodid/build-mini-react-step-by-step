# BUILD a MINI REACT STEP by STEP

## Install
进入mini目录，运行：
``` shell
npm install
```

进入demo目录，运行：
``` shell
npm install
```

``` shell
npm run build
```

``` shell
node server
```

打开浏览器，输入http://localhost:10001







reconciler会调用相应的component的mountComponent, updateComponent等方法，实现类似多态的功能。
每个类型的Component有自己的mountComponent，updateComponent等方法，这些方法会根据component的不同生成相应的DOM节点(HTMLElement)。
但这些节点还是在内存中，还没有和DOM TREE交互，也就是说他们还没有在页面上展示出来。

真正插入到DOM树中，是在MultiChild的updateChildren中通过processQueue来实现的。
