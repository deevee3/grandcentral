import ProfileController from './ProfileController'
import PasswordController from './PasswordController'
import TwoFactorAuthenticationController from './TwoFactorAuthenticationController'
import AiSettingsController from './AiSettingsController'
import YardSettingsController from './YardSettingsController'

const Settings = {
    ProfileController: Object.assign(ProfileController, ProfileController),
    PasswordController: Object.assign(PasswordController, PasswordController),
    TwoFactorAuthenticationController: Object.assign(TwoFactorAuthenticationController, TwoFactorAuthenticationController),
    AiSettingsController: Object.assign(AiSettingsController, AiSettingsController),
    YardSettingsController: Object.assign(YardSettingsController, YardSettingsController),
}

export default Settings