export interface FormSectionProps {
    title: string;
    description: string;
    icon: string;
    isActive: boolean;
    isFilled: boolean;
    hasBeenFilled: boolean;
    isPartiallyFilled?: boolean;
    children: React.ReactNode;
    onFocus: () => void;
  }
  
  export interface FormSectionState {
    isActive: boolean;
    isFilled: boolean;
    hasBeenFilled: boolean;
    isPartiallyFilled?: boolean;
  }
  
  export interface FormSectionConfig {
    id: string;
    title: string;
    description: string;
    icon: string;
    defaultIcon: string;
    filledIcon: string;
    partiallyFilledIcon?: string;
    validateFilled?: (formValues: any) => boolean;
    validatePartiallyFilled?: (formValues: any) => boolean;
  }

  export interface FormSectionsProviderProps {
    children: React.ReactNode;
    sections: FormSectionConfig[];
    initialActiveSection?: string;
    onSectionChange?: (sectionId: string) => void;
    formValues: any;
  }

  export interface FormSectionsContextType {
    sections: FormSectionConfig[];
    sectionStates: Record<string, FormSectionState>;
    activeSection: string;
    activeSectionHeight: number;
    activeSectionTop: number;
    setActiveSection: (sectionId: string) => void;
    setSectionState: (sectionId: string, updates: Partial<FormSectionState>) => void;
    updateSectionDimensions: (sectionId: string, height: number, top: number) => void;
    checkSectionFilled: (sectionId: string) => void;
  }

  export interface FormSectionContainerProps {
    sectionId: string;
    children: React.ReactNode;
  }