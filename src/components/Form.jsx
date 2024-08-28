import axios from "axios";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import Post from "./Post";
import PageData from "./PageData";

export default function Form() {
  const [pages, setPages] = useState([]);
  const [postProps, setPostProps] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPageData, setShowPageData] = useState(false);
  const [selectedPage, setSelectedPage] = useState("");
  const [showPosts, setShowPosts] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handlePageSelect = (e) => {
    setSelectedPage(e.target.value);
    setShowPageData(true);
    setShowPosts(false);
  };

  const handleFormSubmit = (data) => {
    setPostProps(data);
    setShowPageData(false);
    setShowPosts(true);
    console.log(data);
  };

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const response = await axios.post(
          "https://meta-api-eight.vercel.app/api/v1/accounts",
          { limit: "10", after: "", before: "" }
        );
        setPages(response.data.data.data || []);
      } catch (error) {
        console.error("Error fetching pages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPages();
  }, []);

  return (
    <div className="flex flex-col items-center mt-10 min-h-screen">
      <h2 className="text-3xl font-semibold mb-2">MAXMIND</h2>
      <p className="text-gray-500 mb-8">
        Get all the data you need with a few clicks
      </p>

      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="w-full max-w-5xl space-y-4"
      >
        <div className="flex justify-between">
          <select
            {...register("Pages", { required: true })}
            className="w-full px-4 mr-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
            onChange={handlePageSelect}
          >
            <option value="">Select a page</option>
            {loading ? (
              <option>Loading...</option>
            ) : pages.length > 0 ? (
              pages.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))
            ) : (
              <option>No options available</option>
            )}
          </select>

          <input
            type="date"
            placeholder="Start"
            {...register("Start", { required: true })}
            className="px-4 w-fit py-2 mr-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="date"
            placeholder="End"
            {...register("End", { required: true })}
            className="w-fit px-4 py-2 mr-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="number"
            placeholder="Number of Post"
            {...register("Number", { required: true })}
            className="w-fit px-4 py-2 mr-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex justify-center">
          {errors.Pages && (
            <span className="mx-4 text-red-500">Please choose a Page</span>
          )}
          {errors.Start && (
            <span className="mx-4 text-red-500">
              Please fill the Start date
            </span>
          )}
          {errors.End && (
            <span className="mx-4 text-red-500">Please fill the End date</span>
          )}
        </div>

        <div className="flex justify-center">
          <input
            type="submit"
            value="Generate"
            className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {showPageData && selectedPage && (
          <div className="flex justify-center">
            <PageData pageId={selectedPage} />
          </div>
        )}
      </form>

      {showPosts && postProps && (
        <div className="my-4 flex justify-center items-center">
          <Post
            post_id={postProps.Pages}
            since={postProps.Start}
            until={postProps.End}
            limit={postProps.Number}
          />
        </div>
      )}
    </div>
  );
}
