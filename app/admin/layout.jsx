import AdminAuthWrapper from "@/components/admin/AdminAuthWrapper"

export const metadata = {
    title: "GoCart. - Admin",
    description: "GoCart. - Admin",
};

export default function RootAdminLayout({ children }) {

    return (
                <AdminAuthWrapper>.
                    {children}
                </AdminAuthWrapper>
    );
}
