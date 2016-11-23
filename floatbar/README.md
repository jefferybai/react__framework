#说明
右侧浮动菜单组件，目前有发送报告以及回到顶部两个菜单

#用法核心代码示例
```
jsx
import FloatBar from 'components/floatbar'

<FloatBar className="floatbar" ref="floatbar"
    onItemClick={this.floatBarClickHandle.bind(this)} />
```

```
component
class Weekreport extends Component {
    floatBarClickHandle(type) {
        switch (type) {
            case 'sendReport':
                this.sendReport()
                break

            default:
                break
        }
    }

    sendReport() {
        this.refs.floatbar.sendReport({
            apiUrl: '/sendMail',
            mailSubject: '集群运维报告',
            PARA_TOKEN: localStorage.getItem('PARA_TOKEN'),
            userId: userId,
            ...其他任意参数
        })
    }
}
```