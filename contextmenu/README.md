## demo代码
```
import Contextmenu from 'libs/contextmenu';

class Demo extends Component {
    constructor(props) {
        super(props);

        this.state = {
            contextMenu_data: []
        };
    }

    render() {
        <div onContextMenu={this.onContextMenuHandle.bind(this)}>
            右键菜单演示
            <Contextmenu ref="contextMenu" data={} />
        </div>
    }

    onContextMenuHandle(e) {
        e.preventDefault();
        this.setState({
            contextMenu_data: [
                {
                    label: '删除',
                    iconCls: 'glyphicon glyphicon-remove',
                    disabled: true,
                    click: this.btnDelectClick.bind(this)
                },
                {
                    type: 'divider'
                },
                {
                    label: '新建',
                    click: this.btnAddClick.bind(this)
                }
            ]
        });

        this.refs.contextMenu.popup(e.clientX, e.clientY);
    }

    btnDelectClick() {
        alert('删除')
    }

    btnAddClick() {
        alert('新建')
    }
}

```