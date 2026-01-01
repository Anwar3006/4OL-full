type TUserTable = {
  userId: string;
  name: string;
  email: string;
  phoneNumber: string;
  role: string;
  userType: string;
  status: "pending" | "active" | "inactive" | "suspended" | "deleted";
};

type TFacilityTabs = Array<{
  value: string;
  label: string;
  content?: React.ReactNode;
}>;

interface TTabsProps {
  tabs: TFacilityTabs;
  defaultValue?: string;
}
type ControlledDialogProps = {
  open: boolean;
  handleDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
