import ApiFetch from "@/config/api";
import { DashboardAnalyticsInterface } from "@/types/dashboardInterface";


export const fetchDashboardAnalytics = async () => {
      const response = await ApiFetch({
        method: "get",
        url: `/admin/analytics`,
      });
      console.log(response.data);
      const data: DashboardAnalyticsInterface = await response.data;
      console.log(data);
      return data;
  };