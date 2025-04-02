const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const status = require("../utils/status.constants");
const {
  check_if_user_exist_with_Email,
  check_if_user_exist_with_id,
} = require("../utils/userExist");
const { encode_token, decode_token } = require("../utils/token_mgt");
const { generateOtp, generateTempPassword } = require("../utils/generate_otp");
const { role } = require("../utils/user.roles.constant");
const { expressFileUploader } = require("../utils/fileUploads");
const path = require("path");

class UsersController {
  static async create(req, res) {
    try {
      if (!req.body) {
        res
          .status(status.HTTP_422_UNPROCESSABLE_ENTITY)
          .json({ status: 422, message: "unprocessible request body" });
      } else {
        let fileName = null;
        if (req) {
          const file_name = expressFileUploader(req);
          fileName = file_name;
        }
        const blog = await Blog.create({
          title: req?.body?.title,
          subtitle: req?.body?.subtitle,
          content: req?.body?.content,
          imageUrl: fileName,
          category: req?.body?.category,
          author: req?.user,
        });
        res
          .status(status.HTTP_201_CREATED)
          .json({
            status: 201,
            data: blog,
            message: "Blog created successfully.",
          });
      }
    } catch (error) {
      res
        .status(status?.HTTP_500_INTERNAL_SERVER_ERROR)
        .json({ status: 500, message: error?.message });
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        res
          .status(status.HTTP_400_BAD_REQUEST)
          .json({ message: "Provide blog id" });
      }
      if (!req.body) {
        res
          .status(status.HTTP_422_UNPROCESSABLE_ENTITY)
          .json({ status: 422, message: "unprocessible request body" });
      }
      const blog = await Blog.findById({ _id: id });
      if (!blog) {
        return res
          .status(status.HTTP_404_NOT_FOUND)
          .json({ status: 404, message: `Blog with ID: ${id} not found.` });
      }
      let fileName = null;
      if (req) {
        const file_name = expressFileUploader(req);
        fileName = file_name;
      }
      blog.title = req.body.title;
      blog.subtitle = req.body.subtitle;
      blog.content = req.body.content;
      blog.imageUrl = fileName;
      blog.category = req.body.category;
      blog.author = req?.user;

      await blog.save();

      res
        .status(200)
        .json({
          status: 200,
          message: "Blog updated successfully",
          data: blog,
        });
    } catch (error) {
      res
        .status(status.HTTP_500_INTERNAL_SERVER_ERROR)
        .json({ status: 500, message: error.message });
    }
  }

  static async makeBlogPostFeatured(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        res
          .status(status.HTTP_400_BAD_REQUEST)
          .json({ message: "Provide blog id to make featured blog" });
      }
      if (!req.body) {
        res
          .status(status.HTTP_422_UNPROCESSABLE_ENTITY)
          .json({ status: 422, message: "unprocessible request body" });
      }
      const blog = await Blog.findById({ _id: id });
      if (!blog) {
        return res
          .status(status.HTTP_404_NOT_FOUND)
          .json({ status: 404, message: `Blog with ID: ${id} not found.` });
      }
      blog.isFeatured = true;

      await blog.save();
      res
        .status(200)
        .json({
          status: 200,
          message: "Blog featured successfully",
          data: blog,
        });
    } catch (error) {
      res
        .status(status.HTTP_500_INTERNAL_SERVER_ERROR)
        .json({ status: 500, message: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        res
          .status(status.HTTP_400_BAD_REQUEST)
          .json({ message: "Provide blog id to delete blog" });
      }
      const blog = await Blog.findById({ _id: id });
      if (!blog) {
        res
          .status(status.HTTP_404_NOT_FOUND)
          .json({ status: 404, message: `Blog with ID: ${id} not found.` });
      } else {
        const blog = await Blog.findByIdAndDelete({ _id: id });
        res
          .status(status.HTTP_200_OK)
          .json({ status: 200, message: "Blog deleted successfully" });
      }
    } catch (error) {
      res
        .status(status?.HTTP_500_INTERNAL_SERVER_ERROR)
        .json({ status: 500, message: error?.message });
    }
  }

  static async show(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        res
          .status(status.HTTP_400_BAD_REQUEST)
          .json({ message: "Provide blog id to fetch blog details" });
      }
      const blog = await Blog.findById({ _id: id });
      if (!blog) {
        res
          .status(status.HTTP_404_NOT_FOUND)
          .json({ status: 404, message: `Blog with ID: ${id} not found.` });
      }
      res
        .status(status.HTTP_200_OK)
        .json({ status: 200, data: blog, message: "single blog fetched" });
    } catch (error) {
      res
        .status(status?.HTTP_500_INTERNAL_SERVER_ERROR)
        .json({ status: 500, message: error?.message });
    }
  }

  static async index(req, res) {
    try {
      const blogs = await Blog.find({});
      if (!blogs) {
        res
          .status(status?.HTTP_404_NOT_FOUND)
          .json({ status: 404, message: "Cannot fetch blogs" });
      }
      res.status(status?.HTTP_200_OK).json({ status: 200, data: blogs });
    } catch (error) {
      res
        .status(status?.HTTP_500_INTERNAL_SERVER_ERROR)
        .json({ status: 500, message: error?.message });
    }
  }

  static async destroy() {
    try {
    } catch (error) {
      res
        .status(status?.HTTP_500_INTERNAL_SERVER_ERROR)
        .json({ status: 500, message: error?.message });
    }
  }
}

module.exports = UsersController;
