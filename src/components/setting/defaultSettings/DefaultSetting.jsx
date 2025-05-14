import AddUserDefaultSetting from "./AddUserDefaultSetting"
import ThemeSettings from "./ThemeSettings"

function DefaultSetting() {
    return (
        <div className="bg-gradient-to-t from-beige rounded-xl px-8 py-6">
            <AddUserDefaultSetting />
            <ThemeSettings />
        </div>
    )
}

export default DefaultSetting
