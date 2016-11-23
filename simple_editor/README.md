#说明
简单的编辑器组件，有文本框的和文本域的


#使用示例

##简单用法

```
import SimpleEditor from 'simple_editor'

<SimpleEditor
    onChange={this.onEditorValChangeHandle.bind(this)}/>

<SimpleEditor type='textarea' placeholder='点击修改，支持标准markdown语法' />
```

##只使用文本框编辑器

```
import InputEditor from 'simple_editor/input'

<InputEditor
    onChange={this.onEditorValChangeHandle.bind(this)}/>
```

##只使用文本域编辑器

```
import TextareaEditor from 'simple_editor/textarea'

<TextareaEditor placeholder='点击修改，支持标准markdown语法'/>
```