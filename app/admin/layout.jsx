import AdminAuthWrapper from "@/components/admin/AdminAuthWrapper"

export const metadata = {
    title: "Ally-Buy. - Admin",
    description: "Ally-Buy. - Admin",
};

export default function RootAdminLayout({ children }) {

    return (
                <AdminAuthWrapper>.
                    {children}
                </AdminAuthWrapper>
    );
}
