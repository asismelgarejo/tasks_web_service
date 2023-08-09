enum CategoriesEnum {
  EXPLANATION = "EXPLANATION",
  NOTE = "NOTE",
  WARNING = "WARNING",
}
type ApproachDetailModel = {
  content: string;
  category: CategoriesEnum;
};

export default ApproachDetailModel;
