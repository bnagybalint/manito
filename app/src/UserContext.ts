import React from 'react';

import User from 'entity/User';

const UserContext = React.createContext<User | null>(null);

export default UserContext;