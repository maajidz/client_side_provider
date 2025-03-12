interface HeadingProps {
  title: string;
  description?: string;
}

export const Heading: React.FC<HeadingProps> = ({ title, description }) => {
  return (
    <div className="flex gap-2 flex-col w-fit">
      <h2 className="text-2xl font-bold">{title}</h2>
      {description && ( // Only render if description exists
        <p className="text-sm font-medium text-muted-foreground">{description}</p>
      )}
    </div>
  );
};
