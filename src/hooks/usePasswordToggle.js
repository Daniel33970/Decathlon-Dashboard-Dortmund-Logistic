import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react'

export const usePasswordToggle = () => {

    const [visible, setVisiblity] = useState(false);

    const Icon = (
        <FontAwesomeIcon
            icon={visible ? "eye-slash" : "eye"}
            onClick={() => setVisiblity(visiblity => !visiblity)}
        />
    );

    const InputType = visible ? "text" : "password";

    return [InputType, Icon];
  
}
