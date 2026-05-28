import StoreAuthWrapper from "@/components/store/StoreAuthWrapper";

export const metadata = {
    title: "GoCart. - Store Dashboard",
    description: "GoCart. - Store Dashboard",
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
