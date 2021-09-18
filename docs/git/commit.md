# Git commit 规范

## Commit message 的格式
> header 是必需的，body 和 footer 可以省略。
> 不管是哪一个部分，任何一行都不得超过72个字符（或100个字符）。这是为了避免自动换行影响美观。
```html
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

## Header
Header部分只有一行，包括三个字段：type（必需）、scope（可选）和subject（必需）。

## type
用于说明 commit 的类别，只允许使用下面7个标识。

- feat：新功能（feature）
- fix：修补bug
- docs：文档（documentation）
- style： 格式（不影响代码运行的变动）
- refactor：重构（即不是新增功能，也不是修改bug的代码变动）
- test：增加测试
- chore：构建过程或辅助工具的变动

如果type为feat和fix，则该 commit 将肯定出现在 Change log 之中。其他情况（docs、chore、style、refactor、test）由你决定，要不要放入 Change log，建议是不要。

## scope
> scope用于说明 commit 影响的范围，比如数据层、控制层、视图层等等，视项目不同而不同。
> 如果你的修改影响了不止一个scope，你可以使用*代替。

## subject
> subject是 commit 目的的简短描述，不超过50个字符。
* 注意
	- 以动词开头，使用第一人称现在时，比如change，而不是changed或changes
	- 第一个字母小写
	- 结尾不加句号（.）

## Body
> Body 部分是对本次 commit 的详细描述，可以分成多行。下面是一个范例。
```code
More detailed explanatory text, if necessary.  Wrap it to 
about 72 characters or so. 

Further paragraphs come after blank lines.

- Bullet points are okay, too
- Use a hanging indent
```
* 注意
	- 使用第一人称现在时，比如使用change而不是changed或changes。
	- 永远别忘了第2行是空行
	- 应该说明代码变动的动机，以及与以前行为的对比。

## Footer
> Footer 部分只用于以下两种情况：

### 不兼容变动
> 如果当前代码与上一个版本不兼容，则 Footer 部分以BREAKING CHANGE开头，后面是对变动的描述、以及变动理由和迁移方法。
```code
BREAKING CHANGE: isolate scope bindings definition has changed.

    To migrate the code follow the example below:

    Before:

    scope: {
      myAttr: 'attribute',
    }

    After:

    scope: {
      myAttr: '@',
    }

    The removed `inject` wasn't generaly useful for directives so there should be no code using it.
关闭 Issue
```

### 关闭 Issue
> 如果当前 commit 针对某个issue，那么可以在 Footer 部分关闭这个 issue 。

???????

### Revert
> 还有一种特殊情况，如果当前 commit 用于撤销以前的 commit，则必须以revert:开头，后面跟着被撤销 Commit 的 Header。
```code
revert: feat(pencil): add 'graphiteWidth' option

This reverts commit 667ecc1654a317a13331b17617d973392f415f02.
```

## Commitizen - commit 格式化工具
可以使用典型的git工作流程或通过使用CLI向导Commitizen来添加提交消息格式。
### 安装
```sh
npm install -g commitizen
```
然后，在项目目录里，运行下面的命令，使其支持 Angular 的 Commit message 格式。
```sh
commitizen init cz-conventional-changelog --save --save-exact
```
以后，凡是用到git commit命令，一律改为使用git cz。这时，就会出现选项，用来生成符合格式的 Commit message。
![Image text](https://upload-images.jianshu.io/upload_images/3827973-39053e8f0259dfda.png?imageMogr2/auto-orient/strip|imageView2/2/w/557/format/webp)

## validate-commit-msg
validate-commit-msg 用于检查项目的 Commit message 是否符合Angular规范。

该包提供了使用githooks来校验commit message的一些二进制文件。在这里，我推荐使用husky，只需要添加"commitmsg": "validate-commit-msg"到你的package.json中的nam scripts即可.

当然，你还可以通过定义配置文件.vcmrc来自定义校验格式。详细使用请见文档 validate-commit-msg

## 生成 Change log
> 如果你的所有 Commit 都符合 Angular 格式，那么发布新版本时， Change log 就可以用脚本自动生成。生成的文档包括以下三个部分：
- New features
- Bug fixes
- Breaking changes.
每个部分都会罗列相关的 commit ，并且有指向这些 commit 的链接。当然，生成的文档允许手动修改，所以发布前，你还可以添加其他内容。
```sh
npm install -g conventional-changelog
cd my-project
conventional-changelog -p angular -i CHANGELOG.md -w
```

