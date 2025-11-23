export const deliveryPermissions = {
    add: ["manager", "admin"],
    edit: ["manager", "admin"],
    delete: ["manager", "admin"],
    receive: ["inspector"],
    admin_status: ["admin"],
    manager_status: ["manager"],
    inspector_status: ["inspector"],
};

export const statusColorMap = {
    green: { bg: "bg-green-100", text: "text-green-800" },
    yellow: { bg: "bg-yellow-100", text: "text-yellow-800" },
    purple: { bg: "bg-purple-100", text: "text-purple-800" },
    red: { bg: "bg-red-100", text: "text-red-800" },
    blue: { bg: "bg-blue-100", text: "text-blue-800" },
    grey: { bg: "bg-gray-100", text: "text-gray-800" },
};
