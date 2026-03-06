import { gql, useQuery, useMutation } from '@apollo/client';

// ─── GQL Definitions ────────────────────────────────────────

const ME_QUERY = gql`
  query Me {
    me {
      id
      email
      name
      avatar
      role
      isActive
      preferences {
        id
        alertTypes
        regions
        emailNotifications
        smsNotifications
        pushNotifications
      }
      createdAt
      updatedAt
    }
  }
`;

const UPDATE_PROFILE = gql`
  mutation UpdateProfile($name: String, $avatar: String) {
    updateProfile(name: $name, avatar: $avatar) {
      id
      email
      name
      avatar
      role
    }
  }
`;

const UPDATE_PREFERENCES = gql`
  mutation UpdatePreferences(
    $alertTypes: [String!]
    $regions: [String!]
    $emailNotifications: Boolean
    $smsNotifications: Boolean
    $pushNotifications: Boolean
    $theme: String
    $language: String
  ) {
    updatePreferences(
      alertTypes: $alertTypes
      regions: $regions
      emailNotifications: $emailNotifications
      smsNotifications: $smsNotifications
      pushNotifications: $pushNotifications
      theme: $theme
      language: $language
    ) {
      id
      alertTypes
      regions
      emailNotifications
      smsNotifications
      pushNotifications
    }
  }
`;

const NOTIFICATIONS_QUERY = gql`
  query Notifications($pagination: PaginationInput) {
    notifications(pagination: $pagination) {
      id
      type
      recipient
      subject
      message
      status
      sentAt
      deliveredAt
      failureReason
      retryCount
      createdAt
    }
  }
`;

const SYSTEM_HEALTH_QUERY = gql`
  query SystemHealth {
    systemHealth {
      id
      overallStatus
      uptime
      components {
        name
        status
        responseTime
        errorRate
        lastCheck
        details
        errorMessage
      }
      metrics
      lastCheck
    }
  }
`;

const USERS_QUERY = gql`
  query Users($pagination: PaginationInput) {
    users(pagination: $pagination) {
      id
      email
      name
      avatar
      role
      isActive
      createdAt
      updatedAt
    }
  }
`;

const ADMIN_STATS_QUERY = gql`
  query AdminStats {
    adminStats {
      totalUsers
      activeUsers
      totalAlerts
      activeAlerts
      totalStations
      activeStations
      totalNotifications
      recentIngestionLogs {
        id
        source
        status
        recordsProcessed
        recordsFailed
        errorMessage
        startTime
        endTime
        duration
        createdAt
      }
    }
  }
`;

const AUDIT_LOGS_QUERY = gql`
  query AuditLogs($pagination: PaginationInput) {
    auditLogs(pagination: $pagination) {
      id
      userId
      action
      resource
      resourceId
      changes
      ipAddress
      createdAt
    }
  }
`;

const UPDATE_USER_ROLE = gql`
  mutation UpdateUserRole($userId: String!, $role: UserRole!) {
    updateUserRole(userId: $userId, role: $role) {
      id
      email
      name
      role
      isActive
    }
  }
`;

const TOGGLE_USER_ACTIVE = gql`
  mutation ToggleUserActive($userId: String!) {
    toggleUserActive(userId: $userId) {
      id
      email
      name
      role
      isActive
    }
  }
`;

// ─── Hooks ──────────────────────────────────────────────────

export function useMe(options?: { pollInterval?: number }) {
  const { data, loading, error, refetch } = useQuery(ME_QUERY, {
    fetchPolicy: 'cache-and-network',
    ...options,
  });
  return { user: data?.me ?? null, loading, error, refetch };
}

export function useUpdateProfile() {
  const [mutate, { loading, error }] = useMutation(UPDATE_PROFILE);
  const updateProfile = async (variables: { name?: string; avatar?: string }) => {
    const { data } = await mutate({ variables, refetchQueries: [{ query: ME_QUERY }] });
    return data?.updateProfile;
  };
  return { updateProfile, loading, error };
}

export function useUpdatePreferences() {
  const [mutate, { loading, error }] = useMutation(UPDATE_PREFERENCES);
  const updatePreferences = async (variables: {
    alertTypes?: string[];
    regions?: string[];
    emailNotifications?: boolean;
    smsNotifications?: boolean;
    pushNotifications?: boolean;
    theme?: string;
    language?: string;
  }) => {
    const { data } = await mutate({ variables, refetchQueries: [{ query: ME_QUERY }] });
    return data?.updatePreferences;
  };
  return { updatePreferences, loading, error };
}

export function useNotifications(options?: { pollInterval?: number }) {
  const { data, loading, error, refetch } = useQuery(NOTIFICATIONS_QUERY, {
    variables: { pagination: { take: 50 } },
    fetchPolicy: 'cache-and-network',
    ...options,
  });
  return { notifications: data?.notifications ?? [], loading, error, refetch };
}

export function useSystemHealth(options?: { pollInterval?: number }) {
  const { data, loading, error, refetch } = useQuery(SYSTEM_HEALTH_QUERY, {
    fetchPolicy: 'network-only',
    ...options,
  });
  return { health: data?.systemHealth ?? null, loading, error, refetch };
}

export function useUsers(options?: { pollInterval?: number }) {
  const { data, loading, error, refetch } = useQuery(USERS_QUERY, {
    variables: { pagination: { take: 100 } },
    fetchPolicy: 'cache-and-network',
    ...options,
  });
  return { users: data?.users ?? [], loading, error, refetch };
}

export function useAdminStats(options?: { pollInterval?: number }) {
  const { data, loading, error, refetch } = useQuery(ADMIN_STATS_QUERY, {
    fetchPolicy: 'network-only',
    ...options,
  });
  return { stats: data?.adminStats ?? null, loading, error, refetch };
}

export function useAuditLogs(options?: { pollInterval?: number }) {
  const { data, loading, error, refetch } = useQuery(AUDIT_LOGS_QUERY, {
    variables: { pagination: { take: 50 } },
    fetchPolicy: 'cache-and-network',
    ...options,
  });
  return { logs: data?.auditLogs ?? [], loading, error, refetch };
}

export function useUpdateUserRole() {
  const [mutate, { loading, error }] = useMutation(UPDATE_USER_ROLE);
  const updateUserRole = async (userId: string, role: string) => {
    const { data } = await mutate({
      variables: { userId, role },
      refetchQueries: [{ query: USERS_QUERY, variables: { pagination: { take: 100 } } }],
    });
    return data?.updateUserRole;
  };
  return { updateUserRole, loading, error };
}

export function useToggleUserActive() {
  const [mutate, { loading, error }] = useMutation(TOGGLE_USER_ACTIVE);
  const toggleUserActive = async (userId: string) => {
    const { data } = await mutate({
      variables: { userId },
      refetchQueries: [{ query: USERS_QUERY, variables: { pagination: { take: 100 } } }],
    });
    return data?.toggleUserActive;
  };
  return { toggleUserActive, loading, error };
}
