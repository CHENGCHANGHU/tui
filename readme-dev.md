# 开发版本
- node@18.16.0
- pnpm@8.6.4

# 开发
- `pnpm [-w] run dev` or `pnpm -F <tui-package> run dev`
- `cd <tui-package-path>`
- `npm link`
- `pnpm link <tui-package-path>`

# 组件间依赖
- `pnpm -F <tui-package-1> add/remove <tui-package-2>`

# 发布
- 发布前需要构建
- 测试发布：`pnpm --filter=\!playground publish -r --dry-run`

# 测试场
- `pnpm run playground`
