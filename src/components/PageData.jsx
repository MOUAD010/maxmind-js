import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const PageData = ({ pageId }) => {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [insightsData, setInsightsData] = useState([]);
  useEffect(() => {
    const fetchPageData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://meta-api-eight.vercel.app/api/v1/page/${pageId}`
        );
        setPageData(response.data.data); // Set state with response data directly
        setError(null);
        // console.log(response.data.data);
      } catch (error) {
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    if (pageId) {
      fetchPageData();
    }
  }, [pageId]);
  useEffect(() => {
    const fetchPageInsights = async () => {
      try {
        setLoading(true);
        const response = await axios.post(
          `https://meta-api-eight.vercel.app/api/v1/page/summary/${pageId}`,
          {
            metric: "page_post_engagements",
            period: "day",
            since: "2023-11-01",
            until: "2023-12-01",
          }
        );
        // console.log(response.data.data.data[0].values);
        setInsightsData(response.data.data.data[0].values);
        // console.log(insightsData[0].value);

        const cleanInsightsData = insightsData.map((item) => ({
          date: new Date(item.end_time).toLocaleDateString(),
          value: item.value,
        }));

        console.log(cleanInsightsData);

        setError(null);
        console.log();
      } catch (error) {
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchPageInsights();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  if (!pageData) return <div>No data available</div>;

  // Destructuring the page data for cleaner code
  const { cover, name, category, about, fan_count, followers_count } = pageData;

  return (
    <div className="flex justify-center border-2 shadow-lg my-6">
      <div className="w-full">
        {cover && (
          <center className="relative">
            <img
              src={cover.source}
              alt="Cover image"
              width={800}
              height={300}
              className="object-fill"
            />
          </center>
        )}
        <div className="mt-8 mx-10 px-10">
          <h1 className="text-2xl font-bold">{name}</h1>
          <p className="text-muted-foreground">@{category}</p>
          {about && <p className="mt-2">{about}</p>}
          <div className="flex justify-between mt-6">
            <div className="w-full">
              <div className="flex justify-between p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold">{fan_count}</p>
                  <p className="text-muted-foreground">Likes</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{followers_count}</p>
                  <p className="text-muted-foreground">Followers</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Chart displaying daily post engagements */}
        {insightsData.length > 0 && (
          <div className="my-8 mx-10 px-10">
            <h2 className="text-xl font-bold mb-4">Daily Post Engagements</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={insightsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default PageData;
