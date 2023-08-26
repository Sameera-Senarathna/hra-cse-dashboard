import {notification} from 'antd';
import {IconType} from "antd/es/notification";

const showNotification = (type: IconType, message: string) => {
    notification.open({
        type: type,
        message: message
    });
}

export default showNotification;