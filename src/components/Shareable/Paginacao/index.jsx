import React from "react";
import "antd/dist/antd.css";
import "./style.scss";
import { Pagination } from "antd";

export const Paginacao = props => {
  const { total, onChange } = props;
  return (
    <section className="pt-3 footer-pagination-default">
      <Pagination
        defaultCurrent={1}
        defaultPageSize={100}
        onChange={onChange}
        total={total}
        size="medium"
      />
    </section>
  );
};
