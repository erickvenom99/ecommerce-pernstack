import StoreAuthWrapper from "@/components/store/StoreAuthWrapper";

export const metadata = {
    title: "Ally-Buy. - Store Dashboard",
    description: "Ally-Buy. - Store Dashboard",
};

export default function RootAdminLayout({ children }) {

    return (
        <>
            <StoreAuthWrapper>
                {children}
            </StoreAuthWrapper>
        </>
    );
}
