# Users Permissions Page — UI/UX Redesign

## Контекст

`UsersPermissionsFeature.vue` (сторінка керування правами користувача) має чисто функціональний, неоформлений вигляд: відсутня візуальна ієрархія, чекбокс — це сирий `<input type="checkbox">`, таблиця прав використовує захардкоджені `gray-100/200/300` замість семантичних tailwind-токенів проєкту.

Мета: модернізувати вигляд сторінки, використовуючи лише існуючі tailwind-токени (`primary`, `primaryBg`, `secondaryBg`, `borderDefault`, `txtPrimary`, `muted`, `warning`, `success`, `dangerous`, тіні `soft`/`taught`, типографіку `headingCard`/`uiLabel`/`bodyM`/`uiCaption` тощо). **Логіка не змінюється** — всі composables (`usePermissions`, `useSaveUserPermissions`), утиліти (`permissionsTableUi`, `permissionsRows`, ...) залишаються без змін. Усі зміни — це шаблон/розмітка, класи, і один новий **похідний (computed) лічильник** для відображення.

Затверджено через брейнстормінг з мокапами (варіант "A · Refined Table", фінальна v3): http://localhost — карточка користувача, картка-матриця з тулбаром, перемикач "Усі права" в шапці матриці, лічильник "X / Y прав" у картці користувача.

## Обсяг змін

Дозволено: сторінка + пов'язані shared-компоненти, які напряму використовуються цією сторінкою:

1. `src/features/users/UsersPermissionsFeature.vue` — основний шаблон/layout
2. `src/features/users/components/UserPanel.vue` — картка користувача (аватар, бейдж ролі, лічильник прав)
3. `src/shared/ui/common/VCheckbox.vue` — стилізація: дефолтний вигляд → квадратний чекбокс з акцентом `primary`; новий `variant="switch"` для перемикачів
4. `src/shared/ui/table/Table.vue` — заміна `gray-100/200/300` на семантичні токени (`primaryBg`/`secondaryBg`/`borderDefault`), картка з тінню, hover на рядках

Поза обсягом: `VSelect`, `VButton`, API/composables, типи, маршрутизація, dark mode (успадковується автоматично через CSS-змінні теми, окремо не тестується).

## Дизайн

### 1. Картка користувача (`UserPanel.vue`)

Замість трьох рядків простого тексту — горизонтальна картка (`bg-secondaryBg rounded-2xl shadow-soft p-5`, `flex items-center justify-between`):

- **Зліва**: аватар-коло з ініціалами користувача (`w-12 h-12 rounded-full` з градієнтом `from-primary to-borderHover`, текст — ініціали, `text-elevated font-semibold`), поруч — ім'я (`text-headingCard`) та email + "в системі з {createdAt}" (`text-uiCaption text-muted`)
- **Справа**: блок із двох елементів:
  - лічильник **"X / Y"** + підпис "прав надано" (`text-uiHead` / `text-uiCaption text-muted`), вертикально, текстом
  - бейдж ролі (`rounded-full px-3 py-1 text-uiCaption font-semibold`): `Admin` → `bg-warning/15 text-warning`, `User` → `bg-primary/15 text-primary`

**Нові пропси (опціональні, з дефолтами, щоб не зламати інші виклики компонента):**

```ts
type Props = {
  user: UserResponse
  loading: boolean
  role?: selectTypes.Option              // поточна вибрана роль (для бейджа)
  permissionsSummary?: { granted: number; total: number } // "X / Y"
}
```

Якщо `role`/`permissionsSummary` не передані — бейдж і лічильник просто не рендеряться (graceful fallback), тож компонент сумісний з будь-яким іншим можливим використанням.

Skeleton-стан (`loading`) теж оновлюється: 1 кругла `VSkeleton` (аватар) + 2 текстові, у тій же flex-розкладці.

### 2. Новий computed-лічильник у `UsersPermissionsFeature.vue`

Чисто похідне значення з уже існуючого `userPermissions` (Record<string, boolean>), без зміни composables:

```ts
const permissionsSummary = computed(() => {
  const values = Object.values(userPermissions.value)
  return { granted: values.filter(Boolean).length, total: values.length }
})
```

Передається в `<UserPanel :role="selectedRole" :permissions-summary="permissionsSummary" />`.

### 3. Тулбар ролі / "Усі права"

Рядок з `VSelect` (роль) обгортається в таку ж картку, як інші блоки: `bg-secondaryBg rounded-2xl shadow-soft p-5`, `flex items-center gap-6` (сам `VSelect` стилістично без змін — компонент поза обсягом). `VCheckbox` "Select all permissions" видаляється з цього рядка і переноситься у шапку картки-матриці (п.4) як `variant="switch"`.

### 4. Картка-матриця прав

Обгортка `Table` отримує картку: `bg-secondaryBg rounded-2xl shadow-soft p-5` (замість поточного `mt-8` без обгортки). Усередині — тулбар-шапка:

```
[ "Матриця прав" (text-headingCard) ]   [ Усі права (VCheckbox variant="switch") ]
```

під тулбаром — роздільник (`border-b border-borderDefault`), далі сама таблиця.

### 5. `Table.vue` — токени замість сірих хардкодів

- `overflow-auto bg-gray-300` → `overflow-auto bg-secondaryBg` (фон контейнера — той самий, що картки, бо картка вже задає фон і padding)
- Хедер `bg-gray-100` → `bg-primaryBg text-muted` (`text-uiCaption font-semibold uppercase tracking-wide`)
- Рядки `border-b border-gray-200 bg-white` → `border-b border-borderDefault bg-secondaryBg`, додається `hover:bg-primaryBg/60 transition-colors` на рядок
- Порожній стан `bg-white` → `bg-secondaryBg text-muted`

Це торкається й `UsersTableFeature.vue` (та інших споживачів `Table`), що відповідає узгодженому обсягу — результат має виглядати більш консистентно скрізь.

### 6. `VCheckbox.vue` — два візуальні варіанти

```ts
type Props = {
  label?: string
  disabled?: boolean
  modelValue?: boolean
  variant?: 'checkbox' | 'switch'  // default: 'checkbox'
}
```

- **`checkbox`** (дефолт, використовується в матриці прав і всюди, де компонент уже застосовується): квадрат `w-5 h-5 rounded-md border-2 border-borderDefault`, при `checked` → `bg-primary border-primary` + іконка ✓ (inline SVG/`VIcon`), `disabled` → `bg-primaryBg border-borderDefault opacity-60`. Сам `<input>` лишається функціонально тим самим (`type="checkbox"`, ті ж `@change`/`v-model`), але візуально прихований (`sr-only`/`appearance-none`) і замінений стилізованим `<span>`-індикатором поруч, що реагує на стан інпута через клас на `<label>`/`peer`.
- **`switch`**: `w-9 h-5 rounded-full bg-borderDefault` → `bg-primary` коли checked, з кружечком-"бігунком" (`absolute w-4 h-4 rounded-full bg-secondaryBg shadow-soft transition-transform translate-x-4` коли checked).

Зміна не торкається `modelValue`/`update:modelValue`/`disabled` — тож усі існуючі виклики (з `variant` за замовчуванням `'checkbox'`) автоматично отримають новий стилізований квадратний чекбокс замість сирого, без правок коду викликів.

## Поза обсягом / без змін

- Жодних змін у `usePermissions`, `useSaveUserPermissions`, API-шарі, типах `PermsTypes`/`UsersTypes`.
- Порядок/назви колонок, видимість/дизейбл чекбоксів (`isPermissionCheckboxVisible/Disabled/Value`) — без змін.
- Поведінка ролі/admin-lock/select-all — без змін, лише новий computed для відображення.
- Dark mode не тестується окремо, але всі нові класи використовують токени з `createThemes` (light/dark пари), тож має працювати "з коробки".
