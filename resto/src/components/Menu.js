import React from "react";

const Menu = ({ data, title }) => {
  return (
    <div className="menu">
      <h2>{title}</h2>
      <table>
        <thead>
          <tr>
            {title.includes("Makanan") ? (
              <>
                <th>No</th>
                <th>Nama Makanan</th>
                <th>Harga</th>
              </>
            ) : (
              <>
                <th>No</th>
                <th>Nama Minuman</th>
                <th>Harga</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) =>
            title.includes("Makanan") ? (
              <tr key={item.id_makanan}>
                <td>{index + 1}</td>
                <td>{item.nama_makanan}</td>
                <td>Rp{item.harga_makanan}</td>
              </tr>
            ) : (
              <tr key={item.id_minuman}>
                <td>{index + 1}</td>
                <td>{item.nama_minuman}</td>
                <td>Rp{item.harga_minuman}</td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Menu;
